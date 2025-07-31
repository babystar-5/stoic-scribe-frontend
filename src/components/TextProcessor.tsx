import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Sparkles,
  Zap,
  Crown,
  Send,
  Copy as CopyIcon,
  Share2 as ShareIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const stoicQuotes = [
  "We suffer more often in imagination than in reality. – Seneca",
  "Life is long, if you know how to use it. – Seneca",
  "A gem cannot be polished without friction, nor a man perfected without trials. – Seneca",
  "It is not that we have a short time to live, but that we waste a lot of it. – Seneca",
  "Difficulties strengthen the mind, as labour does the body. – Seneca",
  "You have power over your mind — not outside events. Realize this, and you will find strength. – Marcus Aurelius",
  "The impediment to action advances action. What stands in the way becomes the way. – Marcus Aurelius",
  "Everything we hear is opinion, not a fact. Everything we see is a perspective, not the truth. – Marcus Aurelius",
  "Confine yourself to the present. – Marcus Aurelius",
  "Waste no more time arguing about what a good man should be. Be one. – Marcus Aurelius",
  "If it is not right, do not do it. If it is not true, do not say it. – Marcus Aurelius",
  "The best revenge is to be unlike him who performed the injury. – Marcus Aurelius",
  "He who fears death will never do anything worth of a man who is alive. – Seneca",
  "Begin at once to live, and count each separate day as a separate life. – Seneca",
  "As is a tale, so is life: not how long it is, but how good it is, is what matters. – Seneca",
  "No man is free who is not master of himself. – Epictetus",
  "Men are disturbed not by things, but by the view which they take of them. – Epictetus",
  "It is the nature of the wise to resist pleasures, but the foolish to be a slave to them. – Epictetus",
  "We have two ears and one mouth so that we can listen twice as much as we speak. – Epictetus",
  "First say to yourself what you would be; and then do what you have to do. – Epictetus",
  "Don't explain your philosophy. Embody it. – Epictetus",
  "Freedom is the only worthy goal in life. It is won by disregarding things that lie beyond our control. – Epictetus",
  "Man conquers the world by conquering himself. – Zeno of Citium",
  "Happiness is a good flow of life. – Zeno of Citium",
  "Well-being is realized by small steps, but is truly no small thing. – Zeno of Citium",
  "Steel your sensibilities, so that life shall hurt you as little as possible. – Zeno of Citium",
  "Luck is what happens when preparation meets opportunity. – Seneca",
  "To wish to be well is a part of becoming well. – Seneca",
  "He suffers more than necessary, who suffers before it is necessary. – Seneca",
  "You act like mortals in all that you fear, and like immortals in all that you desire. – Seneca",
  "The whole future lies in uncertainty: live immediately. – Seneca",
  "The soul becomes dyed with the color of its thoughts. – Marcus Aurelius",
  "Look well into thyself; there is a source of strength which will always spring up if thou wilt always look. – Marcus Aurelius",
  "How much more grievous are the consequences of anger than the causes of it. – Marcus Aurelius",
  "A man’s worth is no greater than his ambitions. – Marcus Aurelius",
  "Be tolerant with others and strict with yourself. – Marcus Aurelius",
  "Receive without pride, let go without attachment. – Marcus Aurelius",
  "If you want to improve, be content to be thought foolish and stupid. – Epictetus",
  "Circumstances don’t make the man, they only reveal him to himself. – Epictetus",
  "He who laughs at himself never runs out of things to laugh at. – Epictetus",
  "It’s not what happens to you, but how you react to it that matters. – Epictetus",
  "Attach yourself to what is spiritually superior. – Epictetus",
  "You become what you give your attention to. – Epictetus",
  "Be not angry that you cannot make others as you wish them to be, since you cannot make yourself as you wish to be. – Thomas à Kempis",
  "Time is like a river made up of events which happen, and a violent stream; for as soon as a thing has been seen, it is carried away. – Marcus Aurelius",
  "Do every act of your life as though it were the very last act of your life. – Marcus Aurelius",
  "The key is to keep company only with people who uplift you. – Epictetus",
  "Only the educated are free. – Epictetus"
];


export const TextProcessor = () => {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhilosopher, setSelectedPhilosopher] =
    useState("marcus-aurelius");
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);
  const [animate, setAnimate] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setCurrentQuoteIdx((prev) => (prev + 1) % stoicQuotes.length);
        setAnimate(false);
      }, 400); // match animation duration
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const getPhilosopherPrompt = (philosopher: string, text: string) => {
    const prompts = {
      "marcus-aurelius": `Respond to this text as Marcus Aurelius would, with Stoic wisdom, rationality, and focus on virtue, duty, and accepting what we cannot control: "${text}"`,
      seneca: `Respond to this text as Seneca would, with practical Stoic advice, eloquence, and emphasis on wisdom, courage, and living well: "${text}"`,
      epictetus: `Respond to this text as Epictetus would, with direct, practical Stoic teaching about what is within our control and what is not: "${text}"`,
      random: "",
    };

    if (philosopher === "random") {
      const philosophers = ["marcus-aurelius", "seneca", "epictetus"];
      const randomPhilosopher =
        philosophers[Math.floor(Math.random() * philosophers.length)];
      return prompts[randomPhilosopher as keyof typeof prompts];
    }

    return prompts[philosopher as keyof typeof prompts];
  };

  const processText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to get a philosophical response.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get the philosophical response from backend
      const chatResponse = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: getPhilosopherPrompt(selectedPhilosopher, inputText),
            },
          ],
          model: "gpt-4o",
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error(`Chat API request failed: ${chatResponse.status}`);
      }

      const chatData = await chatResponse.json();
      const philosophicalResponse = chatData.choices[0].message.content;
      setResponse(philosophicalResponse);

      // Try TTS, but don't throw if it fails
      try {
        const speechResponse = await fetch("/api/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "tts-1",
            input: philosophicalResponse,
            voice: "alloy",
          }),
        });

        if (!speechResponse.ok) {
          throw new Error(
            `Speech API request failed: ${speechResponse.status}`
          );
        }

        const audioBlob = await speechResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        await audio.play();

        toast({
          title: "Success!",
          description: "Philosophical response generated and playing.",
        });
      } catch (ttsError) {
        toast({
          title: "Speech Error",
          description: "Failed to generate speech, but here is your answer!",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to generate philosophical response. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy answer to clipboard
  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      toast({
        title: "Copied!",
        description: "The answer has been copied to your clipboard.",
      });
    }
  };

  // Share answer using Web Share API or fallback
  const handleShare = () => {
    if (navigator.share && response) {
      navigator.share({
        title: "Stoic Scribe Answer",
        text: response,
        url: window.location.href,
      });
    } else if (response) {
      navigator.clipboard.writeText(response);
      toast({
        title: "Copied!",
        description:
          "Sharing is not supported on this device, so the answer was copied instead.",
      });
    }
  };

  // Embed code for users
  const embedCode = `<iframe src=\"${window.location.origin}\" width=\"100%\" height=\"600\" style=\"border: none; border-radius: 12px; overflow: hidden;\" allow=\"clipboard-write\" title=\"Stoic Scribe\"></iframe>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode.replace(/\\"/g, '"'));
    toast({
      title: "Copied!",
      description: "The embed code has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-2 sm:py-12 sm:px-4">
      <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-3 sm:mb-4">
            <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-spark-primary animate-spark-pulse" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-spark-primary to-spark-secondary bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_100%]">
              Stoic Scribe
            </h1>
            <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-spark-secondary animate-spark-pulse" />
          </div>
          <p className="text-base sm:text-xl text-muted-foreground max-w-full sm:max-w-2xl mx-auto">
            Seek wisdom from the great Stoic philosophers. Ask your question and
            receive timeless guidance from Marcus Aurelius, Seneca, Epictetus,
            or a random sage.
          </p>
        </div>

        {/* Philosopher Selection */}
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50 shadow-xl">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-spark-secondary" />
              <Label className="text-sm font-medium">
                Choose Your Stoic Philosopher
              </Label>
            </div>
            <Select
              value={selectedPhilosopher}
              onValueChange={setSelectedPhilosopher}
            >
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-spark-primary transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marcus-aurelius">
                  Marcus Aurelius - The Emperor Philosopher
                </SelectItem>
                <SelectItem value="seneca">
                  Seneca - The Practical Advisor
                </SelectItem>
                <SelectItem value="epictetus">
                  Epictetus - The Direct Teacher
                </SelectItem>
                <SelectItem value="random">Random Philosopher</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Input Section */}
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50 shadow-xl">
          <div className="space-y-3 sm:space-y-4">
            <Label
              htmlFor="textInput"
              className="text-base sm:text-lg font-semibold flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5 text-spark-primary" />
              Your Question or Thought
            </Label>
            <Textarea
              id="textInput"
              placeholder="Ask your question or share your thoughts for philosophical wisdom..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!isLoading && inputText.trim()) {
                    processText();
                  }
                }
              }}
              className="min-h-[120px] sm:min-h-[200px] bg-background/50 border-border/50 focus:border-spark-primary transition-colors resize-none text-base leading-relaxed"
              disabled={isLoading}
            />
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0">
              <span className="text-xs sm:text-sm text-muted-foreground">
                {inputText.length} characters
              </span>
              <Button
                onClick={processText}
                disabled={isLoading || !inputText.trim()}
                variant="spark"
                size="lg"
                className="min-w-[120px] sm:min-w-[140px] text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Seek Stoic Wisdom
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Loading Section */}
        {/* Removed loading section as per user request */}

        {/* Response Display with Flowing Text */}
        {response && (
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50 shadow-xl">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-spark-secondary" />
                <h3 className="text-base sm:text-lg font-semibold">
                  Philosophical Response
                </h3>
              </div>
              <div className="bg-background/50 rounded-lg p-3 sm:p-4 border border-border/50">
                <div className="text-sm sm:text-base leading-relaxed text-foreground">
                  {response}
                </div>
                <div className="flex gap-2 mt-3 sm:mt-4 justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                    aria-label="Copy answer"
                  >
                    <CopyIcon className="w-4 h-4 mr-1" /> Copy
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleShare}
                    aria-label="Share answer"
                  >
                    <ShareIcon className="w-4 h-4 mr-1" /> Share
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Vertical Scrolling Stoic Quotes Section */}
        <div
          className="w-full flex justify-center items-center min-h-[48px] bg-muted mb-2 relative overflow-hidden"
          style={{ height: "48px" }}
        >
          <div
            className={`transition-transform duration-400 ease-in-out text-spark-primary font-medium text-sm sm:text-base absolute left-0 right-0 text-center ${
              animate
                ? "translate-y-[-100%] opacity-0"
                : "translate-y-0 opacity-100"
            }`}
            style={{ willChange: "transform, opacity" }}
            key={currentQuoteIdx}
          >
            {stoicQuotes[currentQuoteIdx]}
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full text-center text-xs sm:text-sm text-muted-foreground px-2 mt-8 mb-2 flex flex-col items-center gap-2">
          <div>
            <p>
              Part of{" "}
              <a
                href="https://www.oliptherapy.co.uk"
                target="_blank"
                rel="noopener noreferrer"
              >
                Olip Therapy
              </a>
            </p>
          </div>
          <div>
            Embed this app anywhere with:{" "}
            <code className="inline-block bg-muted px-1.5 py-0.5 rounded text-foreground text-xs select-all">
              &lt;iframe src=&quot;https://yourdomain.com&quot;
              width=&quot;100%&quot; height=&quot;600&quot;&gt;&lt;/iframe&gt;
            </code>
          </div>
        </footer>
      </div>
    </div>
  );
};
