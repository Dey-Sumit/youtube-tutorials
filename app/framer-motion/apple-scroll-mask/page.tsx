/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/display-name */
"use client";

import { cn } from "@/lib/utils";
import { forwardRef, RefObject, useRef } from "react";
import { MotionValue, motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { featuresItemData } from "./apple-scroll-mask.data";

// http:localhost:3000/framer-motion/apple-scroll-mask

const DummySection = () => <section className="min-h-screen bg-gray-700 "></section>;

const FeatureSectionItem = forwardRef<HTMLDivElement, (typeof featuresItemData)[number]>(
  ({ classNames, cta, description, iconUrl, onCtaClick, title }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(`min-h-screen flex items-center justify-start p-20`, classNames.container)}
      >
        <div className="_section-content flex text-xl items-start max-w-[380px] flex-col gap-y-4">
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
  const maskSize = useTransform(scrollYProgress, [0, 1], ["100% 0%", "100% 100%"]);

  return (
    <motion.div
      className={cn(
        "absolute overflow-hidden inset-0 ",
        "[mask-image:linear-gradient(rgba(0,0,0,1),rgba(0,0,0,1))] [mask-size:100%_0%] [mask-position:center_bottom] [mask-repeat:no-repeat]"
      )}
      style={{
        maskSize,
      }}
    >
      <img src={imageUrl} alt="" className={cn("object-cover h-full w-full border-2 shadow-2xl")} />
    </motion.div>
  );
};

/* 
  ["start 80%", "start 20%"]:
      - scrollProgress starts when the start of the target meets 80% of the container.
      - scrollProgress ends when the start of the target meets 20% of the container.
*/
const useSectionScroll = (ref: RefObject<HTMLDivElement>) => {
  const { scrollYProgress } = useScroll({
    offset: ["start 80%", "start 20%"], // assuming the device container is 50% of the screen height
    target: ref,
  });
  return scrollYProgress;
};

const AppleScrollMask = () => {
  const targetRefIdx1 = useRef(null);
  const targetRefIdx2 = useRef(null);

  const scrollYProgressRefIdx1 = useSectionScroll(targetRefIdx1);
  const scrollYProgressRefIdx2 = useSectionScroll(targetRefIdx2);
  const scrollYProgressRefIdx0 = useMotionValue(1);

  return (
    <div>
      <DummySection />
      {/*  ----------------------- scroll-wipe section starts ----------------------- */}

      {/* Any area not defined in the mask(using mask size) is treated as fully transparent. */}
      <section>
        <div className="sticky right-0 h-screen top-0 z-20   ml-auto  max-w-[50vw]">
          <div className="--device-container h-[60vh] bg-blue-500 absolute -translate-y-1/2 top-1/2 inset-x-10">
            {featuresItemData.map((item, index) => (
              <WipeContainer
                key={index}
                imageUrl={item.mediaUrl!}
                scrollYProgress={
                  index === 0
                    ? scrollYProgressRefIdx0
                    : index === 1
                    ? scrollYProgressRefIdx1
                    : scrollYProgressRefIdx2
                }
              />
            ))}
          </div>
        </div>
        <div className="-mt-[100vh]">
          {featuresItemData.map((item, index) => (
            <FeatureSectionItem
              key={index}
              ref={index === 0 ? null : index === 1 ? targetRefIdx1 : targetRefIdx2}
              {...item}
            />
          ))}
        </div>
      </section>
      {/*  ----------------------- scroll-wipe section ends ----------------------- */}
      <DummySection />
    </div>
  );
};

export default AppleScrollMask;
