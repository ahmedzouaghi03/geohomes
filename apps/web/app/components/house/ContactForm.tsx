"use client";
import { useState } from "react";

export default function ContactForm({
  adminEmail,
  houseTitle,
  houseId,
  adminPhones = [],
  adminName = "L'annonceur",
}: {
  adminEmail?: string;
  houseTitle: string;
  houseId: string;
  adminPhones?: string[];
  adminName?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [showPhoneInline, setShowPhoneInline] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: adminEmail || "",
          name,
          email,
          subject: `Contact pour l'annonce: ${houseTitle}`,
          message: `Message: ${message}\nTéléphone: ${phone}\nLien annonce: ${window.location.href}`,
        }),
      });
      if (res.ok) setStatus("sent");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  function handleShowPhone() {
    setShowPhonePopup(true);
    setShowPhoneInline(true);
  }

  return (
    <div className="bg-white border rounded-lg shadow p-4 flex flex-col gap-3">
      <h3 className="font-bold text-lg mb-2">Contacter l'annonceur</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border rounded px-3 py-2"
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Votre adresse email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Votre téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <textarea
          className="border rounded px-3 py-2"
          placeholder="Décrivez vos besoins spécifiques"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          required
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Envoi..." : "Contacter"}
        </button>
        {status === "sent" && (
          <div className="text-green-600 text-sm">Message envoyé !</div>
        )}
        {status === "error" && (
          <div className="text-red-600 text-sm">Erreur lors de l'envoi.</div>
        )}
      </form>
      {/* Horizontal line */}
      <hr className="my-2" />

      {/* Afficher le numéro button or phone numbers */}
      {!showPhoneInline ? (
        <button
          type="button"
          className="flex items-center justify-center gap-2 text-blue-700 font-semibold py-2 hover:underline"
          onClick={handleShowPhone}
        >
          <span role="img" aria-label="phone">
            📞
          </span>{" "}
          Afficher le numéro
        </button>
      ) : (
        <div className="flex flex-col items-center gap-1 my-2">
          {adminPhones.length > 0 ? (
            adminPhones.map((num, idx) => (
              <span key={idx} className="text-blue-700 font-bold text-lg">
                {num}
              </span>
            ))
          ) : (
            <span className="text-gray-500">Aucun numéro disponible</span>
          )}
        </div>
      )}

      {/* Popup Modal */}
      {showPhonePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-2xl font-bold text-gray-500 hover:text-gray-700"
              onClick={() => setShowPhonePopup(false)}
            >
              ×
            </button>
            {/* Green box with phone numbers */}
            <div className="bg-green-100 border border-green-300 rounded p-3 mb-4">
              <div className="text-green-900 mb-2">
                Voici le numéro de téléphone du contact.
                <br />
                Merci de dire que vous avez vu l'annonce sur{" "}
                <b>Sousse Planner</b>
              </div>
              {adminPhones.length > 0 ? (
                adminPhones.map((num, idx) => (
                  <div key={idx} className="text-blue-700 font-bold text-lg">
                    {num}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Aucun numéro disponible</div>
              )}
            </div>
            {/* Call-back form */}
            <div className="font-bold text-lg mb-1">
              Désirez-vous être rappelé ?
            </div>
            <div className="text-gray-700 mb-2 text-sm">
              Veuillez nous laisser vos coordonnées sur lesquels vous souhaitez
              être rappelé.
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                className="border rounded px-3 py-2"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="border rounded px-3 py-2"
                placeholder="Votre adresse email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="border rounded px-3 py-2"
                placeholder="Votre téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Envoi..." : "Contacter"}
              </button>
            </form>
            <div className="text-xs text-gray-500 mt-2">
              En cliquant sur "Contacter", j'accepte la politique de protection
              des données
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
