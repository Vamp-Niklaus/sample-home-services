import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import {
  Wrench,
  Armchair,
  Home,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Clock,
  ChevronRight,
  HelpCircle,
  Copy,
  Check,
  Server,
  Workflow,
  ArrowRight,
  PhoneCall,
  Calendar
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  website?: string;
}

export default function App() {
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      message: '',
      website: '',
    },
  });

  const messageValue = watch('message', '');

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    const requestId = crypto.randomUUID();

    try {
      const response = await fetch(
        'https://iazikjmitpbziwahhhjm.supabase.co/functions/v1/contact-submit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request_id: requestId,
            name: data.name,
            email: data.email,
            message: data.message,
            website: data.website || '',
          }),
        }
      );

      const result = await response.json();

      if (response.status === 200 && result.status === 'received') {
        toast.success(`Callback request received! Reference ID: ${requestId}`);
        setLastSubmissionId(requestId);
        reset();
      } else {
        const errorMsg =
          result.error ||
          result.message ||
          result.details ||
          'Failed to submit your request. Please try again.';
        toast.error(errorMsg);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Network error occurred. Please check your connection and try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleServiceSelect = (serviceTitle: string) => {
    setValue(
      'message',
      `Hello, I would like to inquire about your "${serviceTitle}" service. Please arrange a callback with an estimate and weekend/weekday availability.`
    );
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyRequestId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-white selection:bg-[#9E7FFF]/30">
      {/* 1. Top Warning Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-500/20 border-b border-amber-500/30 text-amber-200 py-2.5 px-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide uppercase text-center">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Demonstration only — no services offered</span>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* 2. Header */}
      <header className="border-b border-[#2F2F2F] bg-[#171717]/85 backdrop-blur-md sticky top-[41px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9E7FFF] via-[#38bdf8] to-[#f472b6] p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-[#9E7FFF]/20">
              <div className="w-full h-full bg-[#171717] rounded-[10px] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-[#9E7FFF] group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#9E7FFF] transition-colors">
                Sample Home Services
              </span>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-medium text-[#A3A3A3] uppercase tracking-wider">
                  Live Edge System Demo
                </span>
              </div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A3A3A3]">
            <a
              href="#services"
              className="hover:text-white transition-colors duration-200"
            >
              Services
            </a>
            <a
              href="#pipeline"
              className="hover:text-white transition-colors duration-200"
            >
              Architecture
            </a>
            <a
              href="#faq"
              className="hover:text-white transition-colors duration-200"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#9E7FFF] text-[#171717] font-semibold text-sm hover:bg-[#8b66fa] hover:text-white transition-all duration-200 shadow-md shadow-[#9E7FFF]/20 hover:shadow-[#9E7FFF]/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Request a callback</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 3. Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#9E7FFF]/20 via-[#38bdf8]/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#f472b6]/10 blur-[100px] pointer-events-none -z-10 rounded-full" />
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#38bdf8]/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#262626] border border-[#2F2F2F] text-xs font-medium text-[#A3A3A3] mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#9E7FFF]" />
              <span>Full-Stack Integration: Supabase Edge & Windmill Flow</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E7FFF]" />
              <span className="text-white">v1.0 Production Demo</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
              Sample Home Services{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9E7FFF] via-[#38bdf8] to-[#f472b6]">
                — Demo
              </span>
            </h1>

            {/* Clear Description */}
            <p className="mt-6 text-lg sm:text-xl text-[#A3A3A3] max-w-2xl mx-auto font-normal leading-relaxed">
              Explore our modern home improvement showcase with reliable handyman solutions,
              furniture assembly, and seasonal maintenance. Connect directly via our secure edge intake API.
            </p>

            {/* CTA Button */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#9E7FFF] to-[#8b66fa] text-[#171717] font-bold text-base hover:from-[#8b66fa] hover:to-[#9E7FFF] hover:text-white transition-all duration-300 shadow-xl shadow-[#9E7FFF]/25 hover:shadow-[#9E7FFF]/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Request a callback</span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </a>

              <a
                href="#services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#262626] border border-[#2F2F2F] text-white font-semibold text-base hover:bg-[#303030] hover:border-[#9E7FFF]/50 transition-all duration-200"
              >
                <span>View All Services</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-[#2F2F2F] pt-10">
              <div className="p-4 rounded-xl bg-[#262626]/50 border border-[#2F2F2F]">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                  <span>99.9%</span>
                </div>
                <div className="text-xs text-[#A3A3A3] mt-1">Uptime Reliability</div>
              </div>
              <div className="p-4 rounded-xl bg-[#262626]/50 border border-[#2F2F2F]">
                <div className="text-2xl font-bold text-[#38bdf8] flex items-center justify-center gap-1">
                  <span>250ms</span>
                </div>
                <div className="text-xs text-[#A3A3A3] mt-1">Edge Intake Latency</div>
              </div>
              <div className="p-4 rounded-xl bg-[#262626]/50 border border-[#2F2F2F]">
                <div className="text-2xl font-bold text-[#9E7FFF] flex items-center justify-center gap-1">
                  <span>UUID v4</span>
                </div>
                <div className="text-xs text-[#A3A3A3] mt-1">Traceable Inquiries</div>
              </div>
              <div className="p-4 rounded-xl bg-[#262626]/50 border border-[#2F2F2F]">
                <div className="text-2xl font-bold text-[#f472b6] flex items-center justify-center gap-1">
                  <span>Zero Spam</span>
                </div>
                <div className="text-xs text-[#A3A3A3] mt-1">Honeypot Guarded</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Three Service Cards Section */}
        <section id="services" className="py-20 bg-[#1c1c1c] border-y border-[#2F2F2F] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#9E7FFF]/10 text-[#9E7FFF] text-xs font-semibold uppercase tracking-wider mb-3">
                Expert Home Solutions
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Craftsmanship You Can Depend On
              </h2>
              <p className="mt-4 text-[#A3A3A3] text-base sm:text-lg">
                Select from our top service categories below or specify custom requirements in the contact form.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Small Repairs */}
              <div className="group rounded-2xl bg-[#262626] border border-[#2F2F2F] hover:border-[#9E7FFF]/60 transition-all duration-300 p-8 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#9E7FFF]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#9E7FFF]/5 rounded-bl-full pointer-events-none group-hover:bg-[#9E7FFF]/10 transition-colors" />
                <div>
                  <div className="w-14 h-14 rounded-xl bg-[#9E7FFF]/10 border border-[#9E7FFF]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Wrench className="w-7 h-7 text-[#9E7FFF]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Small Repairs</h3>
                  <p className="text-sm text-[#A3A3A3] leading-relaxed mb-6">
                    Fast, meticulous repairs to keep your household running smoothly without the stress of lingering fixes.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#9E7FFF] shrink-0" />
                      <span>Drywall patches</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#9E7FFF] shrink-0" />
                      <span>Leaky faucets</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#9E7FFF] shrink-0" />
                      <span>Lighting fixtures</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#9E7FFF] shrink-0" />
                      <span>Minor hardware fixes</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleServiceSelect('Small Repairs')}
                  className="w-full py-3 px-4 rounded-xl bg-[#2F2F2F] text-white font-medium text-sm hover:bg-[#9E7FFF] hover:text-[#171717] transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                >
                  <span>Select Small Repairs</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 2: Furniture Assembly */}
              <div className="group rounded-2xl bg-[#262626] border border-[#2F2F2F] hover:border-[#38bdf8]/60 transition-all duration-300 p-8 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#38bdf8]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#38bdf8]/5 rounded-bl-full pointer-events-none group-hover:bg-[#38bdf8]/10 transition-colors" />
                <div>
                  <div className="w-14 h-14 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Armchair className="w-7 h-7 text-[#38bdf8]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Furniture Assembly</h3>
                  <p className="text-sm text-[#A3A3A3] leading-relaxed mb-6">
                    Precision assembly for all major retail brands, flat-packs, and custom home office setups.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                      <span>Bed frames</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                      <span>Desks & workspaces</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                      <span>Shelving units & storage</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                      <span>Custom flat-packs</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleServiceSelect('Furniture Assembly')}
                  className="w-full py-3 px-4 rounded-xl bg-[#2F2F2F] text-white font-medium text-sm hover:bg-[#38bdf8] hover:text-[#171717] transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                >
                  <span>Select Furniture Assembly</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 3: Home Maintenance */}
              <div className="group rounded-2xl bg-[#262626] border border-[#2F2F2F] hover:border-[#f472b6]/60 transition-all duration-300 p-8 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#f472b6]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f472b6]/5 rounded-bl-full pointer-events-none group-hover:bg-[#f472b6]/10 transition-colors" />
                <div>
                  <div className="w-14 h-14 rounded-xl bg-[#f472b6]/10 border border-[#f472b6]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Home className="w-7 h-7 text-[#f472b6]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Home Maintenance</h3>
                  <p className="text-sm text-[#A3A3A3] leading-relaxed mb-6">
                    Proactive upkeep and preventative tasks that protect property value and avert costly emergencies.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#f472b6] shrink-0" />
                      <span>Gutter cleaning</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#f472b6] shrink-0" />
                      <span>HVAC filter replacement</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#f472b6] shrink-0" />
                      <span>Seasonal maintenance</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#f472b6] shrink-0" />
                      <span>Weatherproofing & sealing</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleServiceSelect('Home Maintenance')}
                  className="w-full py-3 px-4 rounded-xl bg-[#2F2F2F] text-white font-medium text-sm hover:bg-[#f472b6] hover:text-[#171717] transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                >
                  <span>Select Home Maintenance</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* System Architecture Explanation Section */}
        <section id="pipeline" className="py-16 bg-[#171717]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-[#202020] border border-[#2F2F2F] p-8 md:p-12 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#38bdf8]/10 text-[#38bdf8] text-xs font-semibold uppercase tracking-wider mb-3">
                    Under The Hood
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Integrated Edge-to-Windmill Pipeline
                  </h3>
                  <p className="mt-3 text-sm text-[#A3A3A3] leading-relaxed">
                    When you submit the contact form, our Supabase Deno Edge Function validates the client-side UUID,
                    checks honeypot parameters, and pushes the payload directly into the Windmill intake workflow
                    script (<code className="text-[#38bdf8] bg-[#262626] px-1.5 py-0.5 rounded text-xs">f/contact_intake/insert_submission</code>).
                  </p>
                </div>

                <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4 text-xs font-mono">
                  <div className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#262626] border border-[#2F2F2F] flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#9E7FFF]" />
                    <div>
                      <div className="text-[#FFFFFF] font-semibold">Client React Form</div>
                      <div className="text-[#A3A3A3] text-[11px]">crypto.randomUUID()</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A3A3A3] hidden sm:block shrink-0" />
                  <div className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#262626] border border-[#2F2F2F] flex items-center gap-3">
                    <Server className="w-4 h-4 text-[#38bdf8]" />
                    <div>
                      <div className="text-[#FFFFFF] font-semibold">Supabase Edge Function</div>
                      <div className="text-[#A3A3A3] text-[11px]">contact-submit</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A3A3A3] hidden sm:block shrink-0" />
                  <div className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#262626] border border-[#2F2F2F] flex items-center gap-3">
                    <Workflow className="w-4 h-4 text-[#f472b6]" />
                    <div>
                      <div className="text-[#FFFFFF] font-semibold">Windmill Flow</div>
                      <div className="text-[#A3A3A3] text-[11px]">contact_intake</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Contact Form Section (#contact) */}
        <section id="contact" className="py-20 bg-[#1a1a1a] border-t border-[#2F2F2F]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#9E7FFF]/10 text-[#9E7FFF] text-xs font-semibold uppercase tracking-wider mb-3">
                Inquiry & Scheduling
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Request a Callback
              </h2>
              <p className="mt-3 text-[#A3A3A3] text-base max-w-xl mx-auto">
                Fill out the form below to request a callback. Submissions are processed in real-time through the Supabase Edge intake service.
              </p>
            </div>

            {/* Weekend Appointments Callout Banner */}
            <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#9E7FFF]/15 via-[#38bdf8]/10 to-[#9E7FFF]/15 border border-[#9E7FFF]/30 shadow-xl shadow-[#9E7FFF]/5 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 -mt-3 -mr-3 w-32 h-32 bg-[#9E7FFF]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#9E7FFF]/20 border border-[#9E7FFF]/40 flex items-center justify-center shrink-0 text-[#9E7FFF] shadow-md shadow-[#9E7FFF]/20">
                    <Calendar className="w-6 h-6 text-[#9E7FFF]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#9E7FFF]/20 text-[#cbb8ff] border border-[#9E7FFF]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                        Weekend Slots Available
                      </span>
                      <span className="text-xs text-[#38bdf8] font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Sat &amp; Sun: 8:00 AM – 6:00 PM
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Weekend Appointments Callout
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A3A3A3] mt-1 leading-relaxed">
                      Need repairs, assembly, or home upkeep this weekend? We schedule convenient Saturday and Sunday appointment windows at no extra charge. Request a callback to confirm slot availability.
                    </p>
                  </div>
                </div>
                <div className="sm:self-center shrink-0 w-full sm:w-auto">
                  <div className="inline-flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2 rounded-xl bg-[#262626]/80 border border-[#2F2F2F] text-xs font-semibold text-emerald-400 w-full sm:w-auto text-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No weekend surcharges</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Success Reference Banner if submitted */}
            {lastSubmissionId && (
              <div className="mb-8 p-5 rounded-2xl bg-[#262626] border border-[#10b981]/50 shadow-lg shadow-[#10b981]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#10b981]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      Callback Request Received!
                    </h4>
                    <p className="text-xs text-[#A3A3A3] mt-0.5 font-mono break-all">
                      Reference ID: <span className="text-[#9E7FFF] font-semibold">{lastSubmissionId}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyRequestId(lastSubmissionId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2F2F2F] hover:bg-[#383838] text-xs font-medium text-gray-200 transition-colors shrink-0 self-start sm:self-center"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-[#10b981]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#A3A3A3]" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* The Form Card */}
            <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-6 sm:p-10 shadow-2xl relative">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* Honeypot field (hidden from view) */}
                <input
                  type="text"
                  {...register('website')}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Your Name <span className="text-[#ef4444]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      disabled={submitting}
                      className={`w-full px-4 py-3 rounded-xl bg-[#171717] border ${
                        errors.name
                          ? 'border-[#ef4444] focus:ring-[#ef4444]'
                          : 'border-[#2F2F2F] focus:border-[#9E7FFF] focus:ring-[#9E7FFF]/20'
                      } text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-50`}
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                        maxLength: {
                          value: 80,
                          message: 'Name cannot exceed 80 characters',
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-[#ef4444] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email Address <span className="text-[#ef4444]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      disabled={submitting}
                      className={`w-full px-4 py-3 rounded-xl bg-[#171717] border ${
                        errors.email
                          ? 'border-[#ef4444] focus:ring-[#ef4444]'
                          : 'border-[#2F2F2F] focus:border-[#9E7FFF] focus:ring-[#9E7FFF]/20'
                      } text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-50`}
                      {...register('email', {
                        required: 'Email address is required',
                        maxLength: {
                          value: 254,
                          message: 'Email cannot exceed 254 characters',
                        },
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address',
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-[#ef4444] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Project Description or Message <span className="text-[#ef4444]">*</span>
                    </label>
                    <span className="text-xs text-[#A3A3A3]">
                      {messageValue.length}/1000 characters
                    </span>
                  </div>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Describe your project, desired weekend or weekday timeslot, required repairs, or any specific instructions..."
                    disabled={submitting}
                    className={`w-full px-4 py-3 rounded-xl bg-[#171717] border ${
                      errors.message
                        ? 'border-[#ef4444] focus:ring-[#ef4444]'
                        : 'border-[#2F2F2F] focus:border-[#9E7FFF] focus:ring-[#9E7FFF]/20'
                    } text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 resize-y`}
                    {...register('message', {
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be between 10 and 1000 characters',
                      },
                      maxLength: {
                        value: 1000,
                        message: 'Message cannot exceed 1000 characters',
                      },
                    })}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-[#ef4444] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button - Request a callback */}
                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-xl bg-[#9E7FFF] text-[#171717] font-bold text-base hover:bg-[#8b66fa] hover:text-white transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-[#9E7FFF]/20 hover:shadow-[#9E7FFF]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#9E7FFF] disabled:hover:text-[#171717]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Requesting callback...</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall className="w-5 h-5" />
                        <span>Request a callback</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Privacy & Honeypot note */}
                <p className="text-center text-xs text-[#A3A3A3]">
                  Protected by honeypot spam detection and client-side UUID verification.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-[#171717] border-t border-[#2F2F2F]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Frequently Asked Questions
              </h3>
              <p className="text-sm text-[#A3A3A3] mt-2">
                Learn more about how this demo application operates
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-[#262626] border border-[#2F2F2F]">
                <h4 className="text-base font-semibold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#9E7FFF]" />
                  Are real services being scheduled through this site?
                </h4>
                <p className="text-sm text-[#A3A3A3] mt-2 pl-6 leading-relaxed">
                  No. As indicated in the banner at the top, this site is strictly a demonstration of an edge-driven lead intake pipeline. No technicians are dispatched and no actual services are offered.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#262626] border border-[#2F2F2F]">
                <h4 className="text-base font-semibold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#38bdf8]" />
                  What happens to my contact form submission?
                </h4>
                <p className="text-sm text-[#A3A3A3] mt-2 pl-6 leading-relaxed">
                  The inquiry is sent to the Supabase Edge Function with a unique cryptographic request ID. It is validated and forwarded to an automated Windmill flow script for processing.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#262626] border border-[#2F2F2F]">
                <h4 className="text-base font-semibold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#f472b6]" />
                  How is spam prevented?
                </h4>
                <p className="text-sm text-[#A3A3A3] mt-2 pl-6 leading-relaxed">
                  We use an invisible honeypot field (<code className="text-[#f472b6] text-xs">website</code>), strict regex email validation, payload size restrictions, and unique UUID tokens to thwart automated spam bots.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2F2F2F] bg-[#121212] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#A3A3A3]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#9E7FFF]/20 border border-[#9E7FFF]/40 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-[#9E7FFF]" />
            </div>
            <div>
              <p className="font-semibold text-white">Sample Home Services — Demo</p>
              <p className="text-xs text-[#A3A3A3]">Demonstration prototype only</p>
            </div>
          </div>

          <div className="text-center md:text-right text-xs space-y-1">
            <p>© {new Date().getFullYear()} Sample Home Services — Demonstration only. No services offered.</p>
            <p className="text-gray-500">
              Powered by Vite, React, Tailwind CSS, Supabase Edge Functions & Windmill.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
