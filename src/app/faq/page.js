"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";

const faqs = [
  {
    id: 1,
    question: "Bagaimana cara upload template?",
    answer: "Untuk upload template, klik tombol 'Create' di navbar atau halaman utama. Isi informasi template (nama, deskripsi, tags), kemudian upload file HTML atau paste kode HTML template Anda. Sistem akan otomatis memvalidasi template Anda.",
  },
  {
    id: 2,
    question: "Format template seperti apa yang didukung?",
    answer: "Kami mendukung file HTML dengan struktur khusus. Template harus memiliki section markers seperti <!-- [HEADER] Section Name --> untuk setiap section. Section types yang didukung: header, hero, about, experience, education, skills, projects, footer, dan custom.",
  },
  {
    id: 3,
    question: "Bagaimana cara menggunakan placeholders?",
    answer: "Placeholders digunakan untuk menampilkan data dinamis. Gunakan format {{placeholderName}} di dalam HTML template. Contoh: {{name}}, {{email}}, {{phone}}. Placeholders akan diganti dengan data yang sesuai saat template digunakan.",
  },
  {
    id: 4,
    question: "Apa itu section markers?",
    answer: "Section markers adalah komentar HTML khusus yang menandai awal setiap section. Format: <!-- [SECTION_TYPE] Section Name --> atau <!-- [SECTION_TYPE] [OPTIONAL] Section Name --> untuk section opsional. Section markers membantu sistem memahami struktur template Anda.",
  },
  {
    id: 5,
    question: "Bagaimana cara edit template yang sudah diupload?",
    answer: "Untuk edit template, buka halaman 'My Templates', kemudian klik tombol 'Edit' pada template yang ingin Anda edit. Anda dapat mengubah nama, deskripsi, tags, dan kode HTML template. Pastikan untuk memvalidasi template setelah melakukan perubahan.",
  },
  {
    id: 6,
    question: "Apa yang harus dilakukan jika template memiliki error?",
    answer: "Jika template memiliki error, validator akan menampilkan pesan error yang spesifik. Perbaiki error tersebut sesuai dengan petunjuk yang diberikan. Pastikan template memiliki struktur HTML yang valid dan section markers yang benar.",
  },
  {
    id: 7,
    question: "Apakah template saya bisa dihapus?",
    answer: "Ya, Anda dapat menghapus template yang telah Anda buat. Buka halaman 'My Templates', kemudian klik tombol 'Delete' pada template yang ingin dihapus. Perhatikan bahwa tindakan ini tidak dapat dibatalkan.",
  },
  {
    id: 8,
    question: "Bagaimana cara membuat template yang baik?",
    answer: "Template yang baik memiliki struktur yang jelas dengan section markers yang tepat, menggunakan placeholders untuk data dinamis, memiliki styling yang konsisten, dan responsive untuk berbagai ukuran layar. Pastikan untuk menguji template sebelum diupload.",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <HelpCircle size={32} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-zinc-400">
            Temukan jawaban untuk pertanyaan umum tentang studio.imuii.id
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className="overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-zinc-400 transition-transform flex-shrink-0 ${
                    openId === faq.id ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-0">
                      <p className="text-zinc-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Masih punya pertanyaan?
            </h3>
            <p className="text-zinc-400 mb-4">
              Jika Anda tidak menemukan jawaban yang Anda cari, silakan hubungi kami
            </p>
            <a
              href="mailto:support@templatehub.com"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              support@templatehub.com
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}

