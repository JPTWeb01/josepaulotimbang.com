"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { submitContact } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await submitContact(form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-subtle focus:outline-none focus:border-primary/60 focus:bg-card transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-xs text-subtle mb-2 font-medium"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Jose Paulo"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-xs text-subtle mb-2 font-medium"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-xs text-subtle mb-2 font-medium"
        >
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          value={form.subject}
          onChange={handleChange}
          placeholder="Project inquiry, job opportunity…"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs text-subtle mb-2 font-medium"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about your project or opportunity…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send size={15} />
              Send message
            </>
          )}
        </button>

        {status === "success" && (
          <p className="text-sm text-success">Message sent! I&apos;ll reply soon.</p>
        )}
        {status === "error" && (
          <p className="text-sm text-danger">
            Something went wrong. Try emailing me directly.
          </p>
        )}
      </div>
    </form>
  );
}
