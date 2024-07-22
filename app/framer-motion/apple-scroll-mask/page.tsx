"use client";

import {
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import { forwardRef, useRef } from "react";
import { featuresItemData } from "../apple-scroll-mask.data";
import { cn } from "@/lib/utils";

const MAC_SILVER = featuresItemData[0].mediaUrl;
const MAC_PINK = featuresItemData[1].mediaUrl;

const DummyContent = () => {
  return <div className="h-screen bg-gray-500 border-2"></div>;
};

const useScrollYProgress = () => {
  const ref = useRef(null);
  /*  ["start end", "end end"]:
    - scrollProgress starts when the start of the target meets end of the container.
    - scrollProgress ends when the end of the target meets end of the container.
  */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "start 30%"], // 70% - 30% = 40% as the inner container height is 40vh
  });

  return { scrollYProgress, ref };
};
const AppleScrollMask = () => {
  const { ref: targetRefIdx1, scrollYProgress: scrollYProgressIdx1 } = useScrollYProgress();
  const { ref: targetRefIdx2, scrollYProgress: scrollYProgressIdx2 } = useScrollYProgress();

  const scrollProgressIdx0 = useMotionValue(1);
  return (
    <main>
      <DummyContent />

      <section>
        <div className="h-screen  sticky top-0 right-0 max-w-[50vw] ml-auto">
          <div className="absolute left-10 right-0 top-1/2 -translate-y-1/2 bg-red-300 border h-[40vh]">
            {featuresItemData.map((item, idx) => {
              return (
                <WipeContainer
                  key={idx}
                  imageUrl={item.mediaUrl}
                  scrollYProgress={
                    idx === 0
                      ? scrollProgressIdx0
                      : idx === 1
                      ? scrollYProgressIdx1
                      : scrollYProgressIdx2
                  }
                />
              );
            })}
          </div>
        </div>

        <div className="-mt-[100vh]">
          {featuresItemData.map((item, idx) => {
            return (
              <FeatureSection
                key={idx}
                {...item}
                ref={idx === 1 ? targetRefIdx1 : idx === 2 ? targetRefIdx2 : null}
              />
            );
          })}
        </div>
      </section>

      <DummyContent />
    </main>
  );
};

export default AppleScrollMask;

const FeatureSection = forwardRef<HTMLDivElement, (typeof featuresItemData)[number]>(
  ({ title, description, iconUrl, classNames, cta, onCtaClick, mediaUrl }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(`min-h-screen flex items-center justify-start p-10`, classNames.container)}
      >
        <div className="_section-content flex text-lg items-start max-w-[380px] flex-col gap-y-4">
          <img src={iconUrl} alt="" className="w-20" />
          <p className=" font-medium ">
            <span className={cn("text-white ", classNames.title)}>{title}</span>
            <span className={cn("text-gray-300 ", classNames.description)}>{description}</span>
          </p>
          <button className={cn("font-medium ", classNames.cta)} onClick={onCtaClick}>
            {cta}
          </button>
        </div>
      </div>
    );
  }
);

const WipeContainer = ({
  imageUrl,
  scrollYProgress,
}: {
  imageUrl: string;
  scrollYProgress: MotionValue<number>;
}) => {
  const transformedMaskSize = useTransform(scrollYProgress, [0, 1], ["100% 0%", "100% 100%"]);

  return (
    <motion.div
      className={cn(
        "absolute inset-0 ",
        "[mask-image:linear-gradient(rgba(0,0,0,1),rgba(0,0,0,1))] [mask-size:100%_0%] [mask-position:center_bottom] [mask-repeat:no-repeat]"
      )}
      style={{ maskSize: transformedMaskSize }}
    >
      <img src={imageUrl} alt="" className="w-full h-full object-cover " />
    </motion.div>
  );
};
