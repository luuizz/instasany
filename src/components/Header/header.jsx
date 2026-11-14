"use client"
import React, { useState } from 'react';
import Image from "next/image"
import Link from "next/link"
import LogoImg from '/public/logo.svg'
import SearchIcon from '/public/icon-search.svg'
import UserIcon from '/public/icon-user.svg'
import { GridContainer } from "../Gridd/grid"
import { HamburgerMenu } from "./HamburgerMenu"
import { MobileMenu } from "../MenuMobile/MenuMobile"

const arrayMenu = [
    'Início',
    'Benefícios',
    'Para quem é o curso',
    'Preços promocionais',
    'Sobre nós'
]

export function Header() {
  const activedStyled = 'bg-green-actived text-opacity-100 rounded-full'

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
    return (
        <header className="w-full relative h-24 bg-green-primary flex items-center">
            <GridContainer className="flex items-center justify-between">
                    <Image
                    src={LogoImg}
                    alt="Logo da Insatasy"
                    />
                <div className="flex items-center gap-20 desktop:gap-4 desktop:text-sm tablet:hidden">
                    <nav className="flex gap-2">
                        {
                            arrayMenu.map((item, index) => (
                                <Link key={index} href="#" className={`px-3 py-1 text-white text-opacity-40 hover:text-opacity-100 transition-all ${index === 0 ? activedStyled : ''}`}>{item}</Link>
                            ))
                        }
                        
                    </nav>
                    <div className="flex items-center gap-6">
                        <button>
                            <Image
                            src={SearchIcon}
                            alt="Ícone de busca"
                            />
                        </button>
                        <button className="flex items-center gap-2">
                            <Image
                            src={UserIcon}
                            alt="Ícone de usuário"
                            />
                            <span className="text-white font-medium">Fazer login</span>
                        </button>
                    </div>
                </div>
                <HamburgerMenu toggleMobileMenu={toggleMobileMenu} />
                { isMobileMenuOpen && <MobileMenu menuItems={arrayMenu} /> }
            </GridContainer>
        </header>
    )
}