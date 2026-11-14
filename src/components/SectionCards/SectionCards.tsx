"use client"
import React, {useRef ,useEffect} from "react"
import Image from "next/image";
import MockupImg from '/public/mockup-main.png'
import Card01 from '/public/image-01.png'
import Card02 from '/public/image-02.png'
import Card03 from '/public/image-03.png'
import Card04 from '/public/image-04.png'
import Card05 from '/public/image-05.png'
import Card06 from '/public/image-06.png'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger)

export function SectionCards() {

    const mockupRef = useRef(null);
    const titleRef = useRef(null);
    const sectionRef = useRef(null);
    const section = sectionRef.current
    const Card01Ref = useRef(null);
    const Card02Ref = useRef(null);
    const Card03Ref = useRef(null);
    const Card04Ref = useRef(null);
    const Card05Ref = useRef(null);
    const Card06Ref = useRef(null);

    function animateCards(images : null[], position : number) {
        gsap.fromTo(images, {
            opacity: 0,
            x: position
        }, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: .1,
            scrollTrigger: {
                trigger: section,
                start: 'center center'
            }
        })
    }

    useEffect(() => {
    const mockupPhone = mockupRef.current
    const title = titleRef.current

    const img01 = Card01Ref.current
    const img02 = Card02Ref.current
    const img03 = Card03Ref.current
    const img04 = Card04Ref.current
    const img05 = Card05Ref.current
    const img06 = Card06Ref.current

    gsap.fromTo(mockupPhone, {
        opacity: 0,
        scale: .5
    }, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power4.out'
    })

    gsap.fromTo(title, {
        opacity: 0,
        y: 100
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: '65% center',

        }
    })

    const leftImages = [img01, img02, img03];
    const rightImages = [img04, img05, img06];

    animateCards(leftImages, 50);
    animateCards(rightImages, -50);

    }, [])
    
    
    return (
        <section className="w-full pb-20" ref={sectionRef}>
            <Image
            src={MockupImg}
            alt="Mockup de uma tela de celular"
            className="sticky z-10 top-56 mx-auto -mt-[32rem] mb-16 opacity-0"
            ref={mockupRef}
            />
            <h2 className="text-center text-7xl font-semibold text-black mb-56 opacity-0" ref={titleRef}>Faça <span className="text-green-title-cards">você</span> mesmo de casa</h2>

            <div className="relative w-full max-w-area-cards mx-auto h-area-cards">
                <Image src={Card01} ref={Card01Ref} className="absolute top-8 left-44 opacity-0" alt="Card 01" />
                <Image src={Card02} ref={Card02Ref} className="absolute bottom-32 left-0 opacity-0" alt="Card 02" />
                <Image src={Card03} ref={Card03Ref}  className="absolute bottom-0 left-80 opacity-0" alt="Card 03" />
                <Image src={Card04} ref={Card04Ref} className="absolute top-0 right-32 opacity-0" alt="Card 04" />
                <Image src={Card05} ref={Card05Ref} className="absolute right-0 bottom-28 opacity-0" alt="Card 05" />
                <Image src={Card06} ref={Card06Ref} className="absolute bottom-0 right-80 opacity-0" alt="Card 06" />
            </div>
        </section>
    )
}