import { Colors, hexFromColor } from "@/generate/types";
import { Variant } from "./components/Variants";
import { PropsWithChildren } from "react";
import { LogoSpace } from "./components/LogoSpace";
import Image from "next/image";
import { Logo } from "./components/Logo";

function Title(props: PropsWithChildren) {
  return (
    <header aria-level={0} className="text-4xl font-bold">
      {props.children}
    </header>
  );
}

function Heading(props: PropsWithChildren) {
  return (
    <header aria-level={1} className="text-2xl font-bold">
      {props.children}
    </header>
  );
}

function Subheading(props: PropsWithChildren) {
  return (
    <header aria-level={2} className="text-xl font-bold">
      {props.children}
    </header>
  );
}

function Subsubheading(props: PropsWithChildren) {
  return (
    <header aria-level={3} className="text-lg font-bold">
      {props.children}
    </header>
  );
}

function Paragraph(props: PropsWithChildren) {
  return <p className="text-base">{props.children}</p>;
}

export default function Home() {
  return (
    <div className="max-w-screen-lg mx-auto flex flex-col gap-16 my-8">
      <section className="flex flex-col gap-4">
        <Title>Logo</Title>
        <Paragraph>
          The ÆSIR logo is the primary visual representation of the association,
          and should be used in all official contexts.
        </Paragraph>
        <Paragraph>
          It is available in two primary variants, with the white logo on the
          ÆSIR background being preferred. If the blueish purple background is
          not suitable, a white logo on a tinted image usually works well.
        </Paragraph>
        <div className="flex flex-wrap gap-4">
          <Variant
            name="aesir_logo"
            foreground={Colors.White}
            background={Colors.ÆSIR}
          />
          <Variant
            name="aesir_logo"
            foreground={Colors.ÆSIR}
            background={Colors.White}
          />
        </div>
        <Paragraph>
          The gray and black logos are used sparingly in cases where color
          cannot be used, for instance on documents that will be printed.
        </Paragraph>
        <div className="flex flex-wrap gap-4">
          <Variant
            name="aesir_logo"
            foreground={Colors.Gray}
            background={Colors.White}
          />
          <Variant
            name="aesir_logo"
            foreground={Colors.Black}
            background={Colors.White}
          />
        </div>
        <Paragraph>
          Around the logo should always be some space. The PNGs already include
          this, but the SVG does not. Roughly the same amount of space as the
          text itself should be used at a minimum.
        </Paragraph>
        <section>
          <LogoSpace />
        </section>
      </section>
      <section className="flex flex-col gap-4">
        <Title>Avatar logo</Title>
        <Paragraph>
          When the full logo is not suitable, for instance in social media
          profile pictures, the ÆSIR avatar logo can be used.
        </Paragraph>
        <Paragraph>
          It is available in just two variants, with the white logo on the ÆSIR
          background being preferred. If the blueish purple background is not
          suitable, a white logo on a tinted image usually works well.
        </Paragraph>
        <div className="flex flex-wrap gap-4">
          <Variant
            name="aesir_avatar"
            foreground={Colors.ÆSIR}
            background={Colors.White}
          />
          <Variant
            name="aesir_avatar"
            foreground={Colors.White}
            background={Colors.ÆSIR}
          />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <Title>Colors</Title>
        <Paragraph>
          The ÆSIR color palette consists of the blueish purple ÆSIR color, and
          a combination of white, black, and gray for text and other elements.
          The blueish purple is part of the design language, and should be
          prevalent on various designs.
        </Paragraph>

        <div className="flex h-24 items-stretch">
          <div
            className="flex-[3] p-2 flex items-end justify-end text-sm font-semibold"
            style={{
              color: hexFromColor(Colors.White),
              backgroundColor: hexFromColor(Colors.ÆSIR),
            }}
          >
            {hexFromColor(Colors.ÆSIR)}
          </div>
          <div
            className="flex-[2] p-2 flex items-end justify-end text-sm font-semibold"
            style={{
              color: hexFromColor(Colors.ÆSIR),
              backgroundColor: hexFromColor(Colors.White),
            }}
          >
            {hexFromColor(Colors.White)}
          </div>
          <div
            className="flex-1 p-2 flex items-end justify-end text-sm font-semibold"
            style={{
              color: hexFromColor(Colors.White),
              backgroundColor: hexFromColor(Colors.Gray),
            }}
          >
            {hexFromColor(Colors.Gray)}
          </div>
          <div
            className="flex-1 p-2 flex items-end justify-end text-sm font-semibold"
            style={{
              color: hexFromColor(Colors.White),
              backgroundColor: hexFromColor(Colors.Black),
            }}
          >
            {hexFromColor(Colors.Black)}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <Title>Typography</Title>
        <Paragraph>
          Either <i>Source Sans Pro</i> or <i>Source Sans</i> should be used as
          the main font of choice. Depending on the source it may be called
          other things. This font is used both for headings and body text, and
          is part of the design language together with the colors and logo.
        </Paragraph>
      </section>
      <section className="flex flex-col bg-white text-black p-8 gap-4">
        <div className="flex items-baseline justify-between">
          <Title>Title</Title>
          <div className="opacity-50">36px / bold</div>
        </div>
        <div className="flex items-baseline justify-between">
          <Heading>Heading</Heading>
          <div className="opacity-50">24px / bold</div>
        </div>
        <div className="flex items-baseline justify-between">
          <Subheading>Subheading</Subheading>
          <div className="opacity-50">20px / bold</div>
        </div>
        <div className="flex items-baseline justify-between">
          <Subsubheading>Subsubheading</Subsubheading>
          <div className="opacity-50">18px / bold</div>
        </div>
        <div className="flex items-baseline justify-between">
          <Paragraph>Paragraph</Paragraph>
          <div className="opacity-50">16px</div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Title>Examples</Title>
        <Paragraph>
          Below are some examples of the logo placed on top of some images. In
          many cases the white logo has sufficient contrast to be used on blue
          sky, or darker images.
        </Paragraph>

        <section className="relative">
          <Image
            alt="Sigmundr Hot Test"
            src={require("@/images/sigmundr_ht.jpg")}
            className="aspect-[4/2] object-cover object-bottom"
          />
          <div className="absolute inset-0 p-[5%] flex items-end justify-end">
            <LogoSvg
              style={{
                width: "auto",
                height: "20%",
                marginBottom: "-1%",
                marginTop: "-1%",
              }}
            />
          </div>
        </section>
        <section className="relative">
          <Image
            alt="Sigmundr Launch"
            src={require("@/images/sigmundr_launch.jpg")}
            className="aspect-[4/2] object-cover object-bottom"
          />
          <div className="absolute inset-0 p-[5%] flex items-start justify-start">
            <LogoSvg
              style={{
                width: "auto",
                height: "20%",
                marginBottom: "-1%",
                marginTop: "-1%",
              }}
            />
          </div>
        </section>
        <section className="relative">
          <Image
            alt="Mjollnir Hot Test"
            src={require("@/images/mjollnir_ht.jpg")}
            className="aspect-[4/2] object-cover"
          />
          <div className="absolute inset-0 p-[5%] flex items-start justify-start">
            <LogoSvg
              style={{
                width: "auto",
                height: "20%",
                marginBottom: "-1%",
                marginTop: "-1%",
              }}
            />
          </div>
        </section>
        <Paragraph>
          If the contrast is not sufficient, a gradient tint could be used. This
          also introduces the color into the image, which can be a nice touch.
        </Paragraph>
        <section className="relative">
          <Image
            alt="Eitr Hot Test"
            src={require("@/images/eitr_ht.jpg")}
            className="aspect-[4/2] object-cover"
          />
          <div className="absolute inset-0 p-[5%] flex items-end justify-end bg-gradient-to-tl from-aesir/75 via-aesir/0 to-aesir/0">
            <LogoSvg
              style={{
                width: "auto",
                height: "20%",
                marginBottom: "-1%",
                marginTop: "-1%",
              }}
            />
          </div>
        </section>
      </section>
    </div>
  );
}

import LogoSvg from "@/../public/generated/aesir_logo/aesir_logo__white.svg";
