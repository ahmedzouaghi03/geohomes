import React from "react";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <section className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 md:p-10">
        <h1 className="text-3xl font-bold text-[#3A5FCD] mb-4 text-center">
          À propos de nous
        </h1>
        <p className="text-gray-700 mb-6 text-center text-lg">
          Bienvenue sur House Location, votre partenaire de confiance pour
          trouver, vendre et louer des biens immobiliers en Tunisie.
        </p>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <img
            src="images/aboutUs.jpg"
            alt="À propos de House Location"
            className="w-full max-w-xs md:max-w-sm rounded-lg shadow-md mb-6 md:mb-0"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[#3A5FCD] mb-2">
              Notre mission
            </h2>
            <p className="text-gray-600 mb-4">
              Nous visons à simplifier le processus d'achat, de vente et de
              location immobilière en offrant une plateforme conviviale, des
              annonces à jour et un accompagnement expert. Que vous recherchiez
              la maison de vos rêves, une location de vacances ou une
              opportunité d'investissement, nous sommes là pour vous aider.
            </p>
            <h2 className="text-xl font-semibold text-[#3A5FCD] mb-2">
              Pourquoi nous choisir ?
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Large choix de biens à travers toute la Tunisie</li>
              <li>Annonces vérifiées et informations transparentes</li>
              <li>Outils de recherche et de filtrage faciles à utiliser</li>
              <li>Support client professionnel et réactif</li>
              <li>Transactions sécurisées et confidentielles</li>
            </ul>
            <h2 className="text-xl font-semibold text-[#3A5FCD] mb-2">
              Nos valeurs
            </h2>
            <p className="text-gray-600">
              L'intégrité, la transparence et la satisfaction client sont au
              cœur de tout ce que nous faisons. Nous nous engageons à rendre
              votre parcours immobilier fluide et réussi.
            </p>
          </div>
        </div>
        <div className="mt-10 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} House Location. Tous droits
          réservés.
        </div>
      </section>
    </main>
  );
}
