import React, { useState } from 'react';
import { ArrowRight, Sparkles, Bookmark, FolderOpen, Share2, Lock, Zap, ExternalLink, BookOpen, Users, Briefcase, Lightbulb, GraduationCap, TrendingUp } from 'lucide-react';
import { RequestInfo } from 'rwsdk/worker';
import { HomeDiscover } from './home-discover';
import WhatYouCanDo from './features';
import { Link } from '@/components/link';
import { Logo } from '@/components/logo';
import { Footer } from '@/components/footer';

export default function Home(props: RequestInfo) {

  const useCases = [
    { icon: Lightbulb, text: "Research collections (e.g., AI tools, learning resources)" },
    { icon: Briefcase, text: "Creative portfolios and resource stacks" },
    { icon: GraduationCap, text: "Personal reading lists and study guides" },
    { icon: Users, text: "Shared links for clients, teams, or communities" }
  ];

  /// when the user is already connected, there's no need to see the landing page. 
  if (props.ctx.user) {
    props.ctx.redirect("/home", 302);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-secondary-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-primary-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className='text-primary-500' />
            <span className="text-2xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Linkee
            </span>
          </div>
          <Link href='/signin' className="px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary-200 shadow-sm">
            <Bookmark className="size-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">No more messy bookmarks</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            <span className="bg-linear-to-r from-primary-600 via-secondary-600 to-blue-600 bg-clip-text text-transparent">
              Organize Your Links<br />Into Smart Collections
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Create structured collections of links grouped by topic, project, or interest — then{' '}
            <span className="font-semibold text-primary-600">share them with one link</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button className="group px-8 py-4 bg-linear-to-r from-primary-500 via-secondary-500 to-primary-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center gap-2 hover:scale-105">
              Create Your First Collection — It's Free
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* Visual Preview */}
          <div className="relative pt-16 pb-8">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-primary-100 p-8">
              <div className="space-y-4">
                {/* Mock Collection Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-primary-100">
                  <div className="size-12 bg-linear-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-2xl">
                    🚀
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-linear-to-r from-primary-200 to-secondary-200 rounded w-48 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-64" />
                  </div>
                </div>
                {/* Mock Links */}
                <div className="grid md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-linear-to-br from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100 hover:shadow-md transition-all duration-200">
                      <div className="h-3 bg-primary-300 rounded w-3/4 mb-2" />
                      <div className="h-2 bg-gray-300 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatYouCanDo />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-blue-600 to-primary-600 bg-clip-text text-transparent">
              How People Use Linkee
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {useCases.map((useCase, i) => (
            <div
              key={i}
              className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-primary-100 hover:border-primary-300 shadow-sm hover:shadow-lg transition-all duration-200 flex items-start gap-4 hover:scale-105 cursor-pointer"
            >
              <div className="shrink-0 size-12 bg-linear-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-200">
                <useCase.icon className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium leading-relaxed">{useCase.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/discover" className="px-6 py-3 bg-white border-2 border-primary-200 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 hover:scale-105">
            See other collections
          </Link>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
              Featured Collections
            </span>
          </h2>
          <p className="text-xl text-gray-600">Discover what others have curated</p>
        </div>

        <HomeDiscover />

        <div className="text-center mt-12">
          <Link href="/signin" className="px-6 py-3 bg-white border-2 border-primary-200 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 hover:scale-105">
            Explore Featured Collections
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 lg:p-16 shadow-2xl border border-primary-100">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex p-4 bg-linear-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg">
              <Zap className="size-10 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold">
              <span className="bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Simple, Fast, Zero Setup
              </span>
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              No complicated dashboards. No long onboarding. Start building a collection in seconds and edit it anytime.
            </p>
            <Link href="/signin" className="group px-6 py-4 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold text-base shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 mx-auto mt-8">
              Start Curating Today — It's Free
              <ArrowRight className="size-6 group-hover:translate-x-2 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function StickyBottom() {
  return <div className="fixed bottom-0 left-0 right-0 z-40 bg-linear-to-r from-primary-600 via-secondary-600 to-blue-600 border-t border-white/20 shadow-2xl backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-white text-center sm:text-left">
        <p className="font-semibold text-lg">Your links. Organized. Ready to share.</p>
      </div>
      <button className="group px-8 py-3 bg-white text-primary-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
        Get Started — Create a Collection
        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>
  </div>
}