import Image from "next/image";

type FeatureSectionType = {
  title: string;
  heading: string;
  description: string;
  imageSource: string;
  isLeft: boolean;
};

export default function FeatureSection({ title, heading, description, imageSource, isLeft }: FeatureSectionType) {
  const image = <Image className="mt-10 w-screen flex-1 md:mt-0" src={imageSource} alt="" />;
  return (
    <div className={`mt-48 flex w-11/12 max-w-5xl ${isLeft ? "flex-col-reverse" : "flex-col"} items-start justify-between md:flex-row md:space-x-12`}>
      {isLeft && image}

      <span className="flex flex-1 flex-col">
        <span className="flex w-full flex-row items-center border-b-[1px] border-bc pb-8 font-mono font-bold">
          <span className="mr-2 aspect-square h-4 w-4 rounded-full bg-pc" />
          {title}
        </span>

        <span className="mt-8 text-5xl font-bold">{heading}</span>
        <span className="mt-8 text-xl">{description}</span>
      </span>

      {!isLeft && image}
    </div>
  );
}
