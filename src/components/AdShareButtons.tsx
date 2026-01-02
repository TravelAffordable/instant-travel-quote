import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Twitter, Facebook, Instagram, Mail, Send, Loader2, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface AdShareButtonsProps {
  adName: string;
  tweetText: string;
  className?: string;
  adContainerRef?: React.RefObject<HTMLDivElement>;
}

const AdShareButtons = ({ adName, tweetText, className = "", adContainerRef }: AdShareButtonsProps) => {
  const [isPostingTwitter, setIsPostingTwitter] = useState(false);
  const [isPostingTwitterWithImage, setIsPostingTwitterWithImage] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  const captureAdAsImage = async (): Promise<string | null> => {
    if (!adContainerRef?.current) {
      toast.error("Cannot capture ad - container not found");
      return null;
    }

    try {
      const canvas = await html2canvas(adContainerRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error capturing ad:", error);
      toast.error("Failed to capture ad image");
      return null;
    }
  };

  const postToTwitter = async (withImage: boolean = false) => {
    if (!tweetText.trim()) {
      toast.error("No content to tweet");
      return;
    }
    
    const truncatedTweet = tweetText.length > 280 ? tweetText.substring(0, 277) + "..." : tweetText;

    if (withImage) {
      setIsPostingTwitterWithImage(true);
    } else {
      setIsPostingTwitter(true);
    }

    try {
      let imageBase64: string | null = null;
      
      if (withImage) {
        imageBase64 = await captureAdAsImage();
        if (!imageBase64) {
          throw new Error("Failed to capture ad image");
        }
      }

      const { data, error } = await supabase.functions.invoke('post-tweet', {
        body: { 
          tweet: truncatedTweet,
          imageBase64: imageBase64
        }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success(`${adName} posted to Twitter${withImage ? ' with image' : ''}!`);
      } else {
        throw new Error(data.error || "Failed to post tweet");
      }
    } catch (error: any) {
      console.error("Tweet error:", error);
      toast.error(error.message || "Failed to post to Twitter");
    } finally {
      setIsPostingTwitter(false);
      setIsPostingTwitterWithImage(false);
    }
  };

  const postToFacebook = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(tweetText);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`,
      '_blank',
      'width=600,height=400'
    );
    toast.success(`Opening Facebook share for ${adName}`);
  };

  const postToInstagram = () => {
    navigator.clipboard.writeText(tweetText);
    toast.success("Caption copied! Open Instagram and paste in your post caption. Screenshot the ad to upload.");
  };

  const sendEmail = async () => {
    if (!emailAddress.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSendingEmail(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-ad-email', {
        body: { 
          email: emailAddress,
          adName: adName,
          adContent: tweetText
        }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success(`${adName} sent to ${emailAddress}!`);
        setEmailAddress("");
        setShowEmailInput(false);
      } else {
        throw new Error(data.error || "Failed to send email");
      }
    } catch (error: any) {
      console.error("Email error:", error);
      toast.error(error.message || "Failed to send email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className={`bg-black/40 backdrop-blur-sm rounded-xl p-4 mt-4 ${className}`}>
      <p className="text-white/70 text-xs mb-3 text-center">Share this ad:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={() => postToTwitter(false)}
          disabled={isPostingTwitter || isPostingTwitterWithImage}
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isPostingTwitter ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Twitter className="w-4 h-4 mr-1" />
              Text
            </>
          )}
        </Button>
        
        {adContainerRef && (
          <Button
            onClick={() => postToTwitter(true)}
            disabled={isPostingTwitter || isPostingTwitterWithImage}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPostingTwitterWithImage ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Camera className="w-4 h-4 mr-1" />
                + Pic
              </>
            )}
          </Button>
        )}
        
        <Button
          onClick={postToFacebook}
          size="sm"
          className="bg-[#1877F2] hover:bg-[#166FE5] text-white"
        >
          <Facebook className="w-4 h-4 mr-1" />
          Facebook
        </Button>
        
        <Button
          onClick={postToInstagram}
          size="sm"
          className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white"
        >
          <Instagram className="w-4 h-4 mr-1" />
          Instagram
        </Button>
        
        <Button
          onClick={() => setShowEmailInput(!showEmailInput)}
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Mail className="w-4 h-4 mr-1" />
          Email
        </Button>
      </div>
      
      {showEmailInput && (
        <div className="mt-3 flex gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className="bg-black/40 border-white/20 text-white placeholder:text-white/40 flex-1"
          />
          <Button
            onClick={sendEmail}
            disabled={isSendingEmail}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSendingEmail ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-1" />
                Send
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdShareButtons;
