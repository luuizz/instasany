"use client"
import React, {useRef, useEffect} from "react"
import Image from "next/image";
import { GridContainer } from "../Gridd/grid";
import IconFile from '/public/icon-file.svg';
import IconHand from '/public/icon-hand.svg';
import IconHand2 from '/public/icon-hand-02.svg'
import IconMockup from '/public/mockup.svg'
import gsap from "gsap";

interface SectionHeroProps {
    title: string | null;
    span: string | null;
    btnText: string | null;
    linkWaiting: string | null;
}

export function SectionHero({ title, span, btnText, linkWaiting }: SectionHeroProps) {

    const textHeroRef = useRef(null) 
    const mockupLeftRef = useRef(null)
    const mockupRightRef = useRef(null)

    useEffect(() => {
        const textHero = textHeroRef.current
        const mLeft = mockupLeftRef.current
        const mRight = mockupRightRef.current

        gsap.fromTo(textHero, {
            opacity: 0,
            y: 20,
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out"
        })

        gsap.fromTo(mLeft, {
            rotate: 0
        }, {
            rotate: -10,
            duration: 1
        })

        gsap.fromTo(mRight, {
            rotate: 0
        }, {
            rotate: 10,
            duration: 1
        })
    }, [])
    


    return (
        <section className="relative w-full bg-green-primary bg-hero bg-no-repeat bg-top h-section-hero border-t border-t-green-border pt-16 overflow-hidden">
            <GridContainer className="flex flex-col items-center">
                <div className="w-full max-w-text-hero text-center opacity-0" ref={textHeroRef}>
                        <h3 className="text-xl font-medium text-green-actived mb-4">{span}</h3>
                        <h1 className="text-white text-7xl/normal font-semibold mb-8">{title}</h1>
                    <div className="flex items-center justify-center gap-10">
                        <button className="flex items-center gap-2">
                            <Image
                            src={IconFile}
                            alt="Ícone de um arquivo"
                            />
                            <span className="text-white font-medium">{linkWaiting}</span>
                        </button>
                        <button className="py-4 px-5 bg-green-btn rounded-full text-green-primary font-bold">
                            {btnText}
                        </button>
                    </div>
                </div>
                <div className="relative w-full max-w-area-icons h-28 mt-4">
                    <Image
                    src={IconHand}
                    alt="Ícone de uma mão"
                    className="absolute left-0 bottom-0"
                    />
                    <Image
                    src={IconHand2}
                    alt="Ícone de uma mão"
                    className="absolute top-0 right-0"
                    />
                </div>
                <div className="absolute -bottom-44 w-full max-w-area-mockups flex justify-between">
                    <Image
                    src={IconMockup}
                    alt="Mockup"
                    className="relative top-[3.1rem] left-[3.3rem]"
                    ref={mockupLeftRef}
                    />
                    <Image
                    src={IconMockup}
                    alt="Mockup"
                    className="relative top-[3.1rem] right-[3.3rem]"
                    ref={mockupRightRef}
                    />
                </div>
            </GridContainer>
        </section>
    )
}