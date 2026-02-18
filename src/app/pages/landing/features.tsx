"use client";
import { Link } from "@/components/link";
import { BookOpen, FolderOpen, Lock, Share2 } from "lucide-react";
import { useState } from "react";

export default function WhatYouCanDo() {
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

    return <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Why Linkits?
                </span>
            </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {[
                {
                    icon: FolderOpen,
                    title: "Store What Matters",
                    description: "Save links the way you think about them — in sections, not chaos.",
                    gradient: "from-purple-500 to-pink-500"
                },
                {
                    icon: BookOpen,
                    title: "Build Knowledge Hubs",
                    description: "Turn scattered links into curated collections you can revisit anytime.",
                    gradient: "from-blue-500 to-cyan-500"
                },
                {
                    icon: Share2,
                    title: "Share Instantly",
                    description: "Send a single Linkits URL instead of a dozen messages.",
                    gradient: "from-green-500 to-emerald-500"
                },
                {
                    icon: Lock,
                    title: "Flexible by Design",
                    description: "Private collections for your workflow. Public ones to showcase your expertise.",
                    gradient: "from-orange-500 to-red-500"
                }
            ].map((feature, i) => (
                <div
                    key={i}
                    className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                    onMouseEnter={() => setHoveredFeature(i)}
                    onMouseLeave={() => setHoveredFeature(null)}
                >
                    <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <div className="relative z-10">
                        <div className={`inline-flex p-3 bg-linear-to-br ${feature.gradient} rounded-xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            <feature.icon className="size-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="text-center mt-12">
            <Link href="/collections/new" className="px-6 py-3 bg-white border-2 border-purple-200 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 hover:scale-105">
                Start a Collection
            </Link>
        </div>
    </section>
}