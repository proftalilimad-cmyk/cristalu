/**
 * Point d'entrée GSAP unique : enregistre les plugins une seule fois et
 * configure les valeurs par défaut du design system CRISTALUM.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { CustomEase } from 'gsap/CustomEase'
import { Observer } from 'gsap/Observer'

let ready = false

export function initGsap() {
  if (ready) return { gsap, ScrollTrigger, SplitText, Flip }
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase, Observer)

  // Eases maison — courbes d'accélération « ingénierie »
  if (!gsap.parseEase('cristal')) {
    CustomEase.create('cristal', '0.22, 1, 0.36, 1')
  }
  if (!gsap.parseEase('alu')) {
    CustomEase.create('alu', '0.65, 0.05, 0.36, 1')
  }
  if (!gsap.parseEase('glass')) {
    CustomEase.create('glass', '0.16, 0.84, 0.24, 1')
  }

  gsap.defaults({ ease: 'cristal', duration: 0.9 })
  ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' })
  ready = true
  return { gsap, ScrollTrigger, SplitText, Flip }
}

export { gsap, ScrollTrigger, SplitText, Flip, Observer }
export default gsap
