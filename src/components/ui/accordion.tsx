'use client';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {Plus} from 'lucide-react';

export function FaqAccordion({items}:{items: {question:string;answer:string}[]}) {
  return <AccordionPrimitive.Root type="single" collapsible className="faq-list">{items.map((faq)=>
    <AccordionPrimitive.Item key={faq.question} value={faq.question}>
      <AccordionPrimitive.Header><AccordionPrimitive.Trigger>{faq.question}<Plus size={18} aria-hidden/></AccordionPrimitive.Trigger></AccordionPrimitive.Header>
      <AccordionPrimitive.Content><p>{faq.answer}</p></AccordionPrimitive.Content>
    </AccordionPrimitive.Item>)}</AccordionPrimitive.Root>;
}
