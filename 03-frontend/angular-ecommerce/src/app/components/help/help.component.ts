import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on all items. If you\'re not completely satisfied with your purchase, you can return the product within 30 days of delivery for a full refund or exchange. The item must be unused, in the original packaging, and with the receipt or proof of purchase. Please contact our customer support team to initiate a return.',
      open: false
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order has been shipped, you will receive an email confirmation with a tracking number and a link to the carrier’s website. You can use this link to track your order in real time. You can also log in to your account on our website and go to the "My Orders" section to view the status of your order.',
      open: false
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. We also offer financing options through our partnership with Klarna. You can select your preferred payment method during checkout.',
      open: false
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship internationally to select countries. Shipping fees and delivery times vary depending on the destination. Please check our Shipping Policy page for a list of countries we ship to and additional details on international shipping rates and times.',
      open: false
    },
    {
      question: 'How do I apply a discount code?',
      answer: 'To apply a discount code, enter the code in the "Promo Code" field at checkout and click "Apply." The discount will be deducted from your order total. Please note that only one discount code can be applied per order and some exclusions may apply.',
      open: false
    },
    {
      question: 'What should I do if I receive a damaged or defective product?',
      answer: 'If you receive a damaged or defective product, please contact our customer support team within 7 days of delivery. Provide your order number, a description of the issue, and any photos of the damage. We will assist you with a replacement or a full refund, including any shipping costs.',
      open: false
    },
    {
      question: 'Can I change or cancel my order after it has been placed?',
      answer: 'Orders can be modified or canceled within 1 hour of placing them. After this window, we begin processing your order, and it may not be possible to change or cancel it. Please contact our customer support team immediately if you need to make changes, and we will do our best to assist you.',
      open: false
    },
    {
      question: 'How long will it take to receive my order?',
      answer: 'Delivery times vary based on your location and the shipping method chosen at checkout. Standard shipping typically takes 3-7 business days, while expedited shipping options are available for faster delivery. International orders may take 7-14 business days depending on customs and local postal services.',
      open: false
    },
    {
      question: 'How do I create an account?',
      answer: 'To create an account, click on the "Sign Up" or "Register" button on our homepage. Fill in the required fields with your name, email address, and password. You will receive a confirmation email with a link to activate your account. Once activated, you can log in and start shopping!',
      open: false
    },
    {
      question: 'Do you offer gift cards?',
      answer: 'Yes, we offer digital gift cards in various denominations. Gift cards can be purchased directly from our website and will be delivered via email to the recipient. They can be used for any product on our website and do not expire. Gift cards are non-refundable and cannot be redeemed for cash.',
      open: false
    }
  ];

  toggleAnswer(faq: any) {
    faq.open = !faq.open;
  }
}

