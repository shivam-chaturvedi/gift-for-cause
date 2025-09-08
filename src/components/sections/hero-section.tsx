import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Gift, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const stats = [
  { value: 10000, label: "Lives Impacted", icon: Heart, suffix: "+" },
  { value: 500, label: "Gifts Delivered", icon: Gift, suffix: "+" },
  { value: 150, label: "NGO Partners", icon: Users, suffix: "+" },
];

export function HeroSection() {
  const navigate = useNavigate();

  const handleStartGiving = () => {
    navigate("/browse", { replace: true });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent-light/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Highlight Badge */}
            <div className="inline-flex items-center space-x-2 bg-accent-light/50 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
              <Heart className="w-4 h-4 text-primary" />
              <span>Transform Every Occasion Into Impact</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Gift for a Cause
              </span>
              <br />
              <span className="text-foreground">Make Every Gift Matter</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Turn birthdays, anniversaries, and celebrations into opportunities
              to create real impact. Browse NGO wishlists and give gifts that
              truly change lives.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="hero"
                size="hero"
                onClick={handleStartGiving}
                className="group flex items-center justify-center"
              >
                Start Giving Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button variant="outline" size="hero" asChild>
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    <AnimatedCounter
                      end={stat.value}
                      duration={2}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Animation */}
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 backdrop-blur-sm border border-white/20 shadow-strong text-center space-y-6">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-accent to-primary shadow-glow justify-center mx-auto">
                <Gift className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-foreground">
                🎉 Birthday Gift
              </h3>
              <p className="text-muted-foreground">
                Instead of flowers, send school supplies to children in need
              </p>

              <div className="flex justify-center">
                <Button
                  onClick={handleStartGiving}
                  variant="celebration"
                  className="animate-bounce-gentle"
                >
                  Make Impact ✨
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
