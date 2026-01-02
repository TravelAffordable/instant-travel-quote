import { createHmac } from "node:crypto";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")?.trim();

function validateEnvironmentVariables() {
  if (!API_KEY) {
    throw new Error("Missing TWITTER_CONSUMER_KEY environment variable");
  }
  if (!API_SECRET) {
    throw new Error("Missing TWITTER_CONSUMER_SECRET environment variable");
  }
  if (!ACCESS_TOKEN) {
    throw new Error("Missing TWITTER_ACCESS_TOKEN environment variable");
  }
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("Missing TWITTER_ACCESS_TOKEN_SECRET environment variable");
  }
}

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(
    url
  )}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&")
  )}`;
  const signingKey = `${encodeURIComponent(
    consumerSecret
  )}&${encodeURIComponent(tokenSecret)}`;
  const hmacSha1 = createHmac("sha1", signingKey);
  const signature = hmacSha1.update(signatureBaseString).digest("base64");

  return signature;
}

function generateOAuthHeader(method: string, url: string, additionalParams: Record<string, string> = {}): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: API_KEY!,
    oauth_nonce: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN!,
    oauth_version: "1.0",
  };

  // Combine oauth params with additional params for signature
  const allParams = { ...oauthParams, ...additionalParams };

  const signature = generateOAuthSignature(
    method,
    url,
    allParams,
    API_SECRET!,
    ACCESS_TOKEN_SECRET!
  );

  const signedOAuthParams = {
    ...oauthParams,
    oauth_signature: signature,
  };

  const entries = Object.entries(signedOAuthParams).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    "OAuth " +
    entries
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ")
  );
}

const TWEET_URL = "https://api.x.com/2/tweets";
const MEDIA_UPLOAD_URL = "https://upload.twitter.com/1.1/media/upload.json";

async function uploadMedia(mediaData: string): Promise<string> {
  console.log("Starting media upload...");
  
  // Remove data URL prefix if present
  const base64Data = mediaData.replace(/^data:image\/\w+;base64,/, '');
  
  const params = {
    media_data: base64Data,
  };

  const oauthHeader = generateOAuthHeader("POST", MEDIA_UPLOAD_URL, params);
  
  const formData = new URLSearchParams();
  formData.append("media_data", base64Data);

  console.log("Uploading media to Twitter...");
  
  const response = await fetch(MEDIA_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: oauthHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const responseText = await response.text();
  console.log("Media upload response status:", response.status);

  if (!response.ok) {
    console.error("Media upload failed:", responseText);
    throw new Error(`Media upload failed: ${response.status} - ${responseText}`);
  }

  const result = JSON.parse(responseText);
  console.log("Media uploaded successfully, media_id:", result.media_id_string);
  
  return result.media_id_string;
}

async function sendTweet(tweetText: string, mediaIds?: string[]): Promise<any> {
  const method = "POST";
  
  const tweetBody: any = { text: tweetText };
  
  if (mediaIds && mediaIds.length > 0) {
    tweetBody.media = { media_ids: mediaIds };
  }

  // For v2 API, we don't include body params in OAuth signature
  const oauthHeader = generateOAuthHeader(method, TWEET_URL);

  console.log("Posting tweet...", { hasMedia: !!mediaIds });

  const response = await fetch(TWEET_URL, {
    method: method,
    headers: {
      Authorization: oauthHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tweetBody),
  });

  const responseText = await response.text();
  console.log("Tweet response status:", response.status);

  if (!response.ok) {
    console.error("Tweet failed:", responseText);
    throw new Error(`Twitter API error: ${response.status} - ${responseText}`);
  }

  return JSON.parse(responseText);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    validateEnvironmentVariables();
    const body = await req.json();
    
    if (!body.tweet || typeof body.tweet !== 'string') {
      throw new Error("Tweet text is required");
    }

    // Truncate tweet if too long (especially when image is attached, character limit is more flexible)
    let tweetText = body.tweet;
    if (!body.imageBase64 && tweetText.length > 280) {
      throw new Error("Tweet exceeds 280 character limit");
    }
    
    // For tweets with images, Twitter allows up to 280 chars for text
    if (tweetText.length > 280) {
      tweetText = tweetText.substring(0, 277) + "...";
    }

    let mediaIds: string[] | undefined;
    
    // If image is provided, upload it first
    if (body.imageBase64) {
      console.log("Image data received, uploading media...");
      const mediaId = await uploadMedia(body.imageBase64);
      mediaIds = [mediaId];
    }

    const result = await sendTweet(tweetText, mediaIds);
    
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Tweet posting error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
