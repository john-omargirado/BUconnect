"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, prefer-const, @typescript-eslint/no-unused-vars */

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface RewardConfig {
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  glowEffect?: boolean;
  background?: string;
  textColor?: string;
  animation?: string;
  pattern?: string;
  glowColor?: string;
  type?: string;
  color?: string;
  intensity?: string;
  title?: string;
  style?: string;
  [key: string]: any;
}

interface RewardEffectsProps {
  children: ReactNode;
  rewardType?: "profile" | "card" | "container";
  profileBorder?: RewardConfig;
  cardTheme?: RewardConfig;
  badge?: RewardConfig;
  specialEffect?: RewardConfig;
  title?: RewardConfig;
  className?: string;
}

export default function RewardEffects({
  children,
  rewardType = "container",
  profileBorder,
  cardTheme,
  badge,
  specialEffect,
  title,
  className = ""
}: RewardEffectsProps) {
  // Build dynamic styles based on active rewards
  const getDynamicStyles = () => {
    let styles: React.CSSProperties = {};
    let motionProps: any = {};
    let needsGradientWrapper = false;

    // Apply profile border effects
    if (rewardType === "profile" && profileBorder) {
      // Check if this is a gradient border
      if (profileBorder.borderColor?.includes('linear-gradient')) {
        needsGradientWrapper = true;
        // For gradient borders, we'll use a wrapper approach
        styles.borderRadius = "50%";
        styles.padding = profileBorder.borderWidth || "2px";
        styles.background = profileBorder.borderColor;

        if (profileBorder.glowEffect) {
          styles.boxShadow = "0 0 15px rgba(255, 255, 255, 0.5)";
        }
      } else if (profileBorder.borderColor) {
        styles.border = `${profileBorder.borderWidth || "2px"} ${profileBorder.borderStyle || "solid"} ${profileBorder.borderColor}`;

        if (profileBorder.glowEffect && profileBorder.borderColor) {
          styles.boxShadow = `0 0 15px ${profileBorder.borderColor}`;
        }
      }

      // Ensure circular shape is maintained for profile borders
      if (!needsGradientWrapper) {
        styles.borderRadius = "50%";
      }

      // Add animations based on border type
      if (profileBorder.animation === "rainbow") {
        if (needsGradientWrapper) {
          motionProps.animate = {
            background: [
              "linear-gradient(0deg, #ff0000, #ff8c00, #ffd700, #00ff00, #0000ff, #8b00ff)",
              "linear-gradient(60deg, #ff0000, #ff8c00, #ffd700, #00ff00, #0000ff, #8b00ff)",
              "linear-gradient(120deg, #ff0000, #ff8c00, #ffd700, #00ff00, #0000ff, #8b00ff)",
              "linear-gradient(180deg, #ff0000, #ff8c00, #ffd700, #00ff00, #0000ff, #8b00ff)",
              "linear-gradient(240deg, #ff0000, #ff8c00, #ffd700, #00ff00, #0000ff, #8b00ff)",
              "linear-gradient(300deg, #ff0000, #ff8c00, #ffd700, #00ff00, #0000ff, #8b00ff)",
              "linear-gradient(360deg, #ff0000, #ff8c00, #ffd700, #00ff00, #0000ff, #8b00ff)"
            ]
          };
        } else {
          motionProps.animate = {
            borderColor: [
              "#ff0000", "#ff8c00", "#ffd700", "#00ff00", "#0000ff", "#8b00ff", "#ff0000"
            ]
          };
        }
        motionProps.transition = {
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        };
      } else if (profileBorder.animation === "sparkle") {
        if (needsGradientWrapper) {
          motionProps.animate = {
            boxShadow: [
              "0 0 5px rgba(255, 255, 255, 0.3)",
              "0 0 25px rgba(255, 255, 255, 0.8)",
              "0 0 5px rgba(255, 255, 255, 0.3)"
            ]
          };
        } else {
          motionProps.animate = {
            boxShadow: [
              `0 0 5px ${profileBorder.borderColor}`,
              `0 0 25px ${profileBorder.borderColor}`,
              `0 0 5px ${profileBorder.borderColor}`
            ]
          };
        }
        motionProps.transition = {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        };
      }
    }

    // Apply card theme effects
    if (rewardType === "card" && cardTheme) {
      if (cardTheme.background) {
        styles.background = cardTheme.background;
      }

      if (cardTheme.textColor) {
        styles.color = cardTheme.textColor;
      }

      // Add card animations
      if (cardTheme.animation === "glow") {
        motionProps.whileHover = {
          boxShadow: `0 0 20px ${cardTheme.glowColor || "rgba(255, 255, 255, 0.5)"}`,
        };
      } else if (cardTheme.animation === "neon") {
        motionProps.animate = {
          boxShadow: [
            `0 0 5px ${cardTheme.glowColor}`,
            `0 0 15px ${cardTheme.glowColor}`,
            `0 0 5px ${cardTheme.glowColor}`
          ]
        };
        motionProps.transition = {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        };
      } else if (cardTheme.animation === "twinkle") {
        motionProps.animate = {
          opacity: [1, 0.8, 1]
        };
        motionProps.transition = {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        };
      }
    }

    // Apply special effects
    if (specialEffect) {
      if (specialEffect.type === "glow_aura") {
        const glowColor = specialEffect.color || "#fbbf24";
        styles.boxShadow = `0 0 20px ${glowColor}40`;

        motionProps.animate = {
          boxShadow: [
            `0 0 10px ${glowColor}20`,
            `0 0 30px ${glowColor}60`,
            `0 0 10px ${glowColor}20`
          ]
        };
        motionProps.transition = {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        };
      } else if (specialEffect.type === "particle_trail") {
        // Particle trail effect would require more complex implementation
        motionProps.whileHover = {
          scale: 1.02,
        };
      }
    }

    return { styles, motionProps, needsGradientWrapper };
  };

  const { styles, motionProps, needsGradientWrapper } = getDynamicStyles();

  // Combine className
  const combinedClassName = `${className} ${getAdditionalClasses()}`.trim();

  function getAdditionalClasses(): string {
    let classes: string[] = [];

    // Add pattern classes for card themes
    if (rewardType === "card" && cardTheme?.pattern) {
      switch (cardTheme.pattern) {
        case "waves":
          classes.push("relative overflow-hidden");
          break;
        case "stars":
          classes.push("relative");
          break;
        case "circuit":
          classes.push("relative");
          break;
        case "fire":
          classes.push("relative overflow-hidden");
          break;
      }
    }

    return classes.join(" ");
  }

  // Render with motion wrapper if animations are present
  if (Object.keys(motionProps).length > 0) {
    if (needsGradientWrapper && rewardType === "profile") {
      return (
        <motion.div
          className={`${combinedClassName} flex items-center justify-center`}
          style={styles}
          {...motionProps}
        >
          <div
            className="w-full h-full rounded-full bg-background"
            style={{
              width: 'calc(100% - 4px)',
              height: 'calc(100% - 4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {children}
          </div>
          {renderPatterns()}
        </motion.div>
      );
    }

    return (
      <motion.div
        className={combinedClassName}
        style={styles}
        {...motionProps}
      >
        {children}
        {renderPatterns()}
      </motion.div>
    );
  }

  // Render static version
  if (needsGradientWrapper && rewardType === "profile") {
    return (
      <div
        className={`${combinedClassName} flex items-center justify-center`}
        style={styles}
      >
        <div
          className="w-full h-full rounded-full bg-background"
          style={{
            width: 'calc(100% - 4px)',
            height: 'calc(100% - 4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {children}
        </div>
        {renderPatterns()}
      </div>
    );
  }

  return (
    <div className={combinedClassName} style={styles}>
      {children}
      {renderPatterns()}
    </div>
  );

  function renderPatterns() {
    if (rewardType !== "card" || !cardTheme?.pattern) return null;

    switch (cardTheme.pattern) {
      case "waves":
        return (
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z"
                fill="currentColor"
                opacity="0.3"
              />
            </svg>
          </div>
        );

      case "stars":
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${15 + (i % 3) * 25}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );

      case "circuit":
        return (
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <g stroke="currentColor" strokeWidth="0.5" fill="none">
                <path d="M10,10 L90,10 L90,30 L70,30" />
                <path d="M30,10 L30,50 L70,50" />
                <path d="M50,30 L50,70 L90,70" />
                <circle cx="70" cy="30" r="2" fill="currentColor" />
                <circle cx="70" cy="50" r="2" fill="currentColor" />
                <circle cx="50" cy="70" r="2" fill="currentColor" />
              </g>
            </svg>
          </div>
        );

      default:
        return null;
    }
  }
}
