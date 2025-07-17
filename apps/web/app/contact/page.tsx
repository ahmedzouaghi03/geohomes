import BackButton from "@/components/ui/BackButton";
import React from "react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-4">
      <section className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 md:p-10">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-3xl font-bold text-[#3A5FCD] text-center">
            Contactez-nous
          </h1>
        </div>
        <p className="text-gray-600 mb-8 text-center">
          Une question, une suggestion ou envie de nous contacter ? Remplissez
          le formulaire ci-dessous et notre équipe vous répondra dans les plus
          brefs délais.
        </p>
        <form className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1" htmlFor="name">
                Nom
              </label>
              <input
                id="name"
                type="text"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
                placeholder="Votre nom"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A5FCD]"
                placeholder="vous@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A5FCD] resize-none"
              placeholder="Tapez votre message ici..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#3A5FCD] text-white font-semibold py-3 rounded-md hover:bg-[#193997] transition"
          >
            Envoyer le message
          </button>
        </form>
        <div className="mt-8 text-center text-gray-500 text-sm">
          Ou écrivez-nous directement à{" "}
          <a
            href="mailto:contact@sousseplanner.com"
            className="text-[#3A5FCD] underline"
          >
            contact@sousseplanner.com
          </a>
        </div>
      </section>
    </main>
  );
}
