'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Camera, MapPin, Package, DollarSign, FileText, Tag } from 'lucide-react';
import { Button } from '@/components/Button';
import { ImageUploader } from '@/components/ImageUploader';
import { ToastContainer, useToast } from '@/components/Toast';
import { AIInsights } from '@/components/AIInsights';
import { PriceRecommendation } from '@/components/PriceRecommendation';
import { cn } from '@/lib/utils';
import { createLapak, analyzeImages } from '@/lib/lapakService';

// Category options
const CATEGORIES = [
  { id: 'makanan', label: 'Makanan', icon: '🍽️' },
  { id: 'minuman', label: 'Minuman', icon: '🥤' },
  { id: 'sayuran', label: 'Sayuran', icon: '🥬' },
  { id: 'buah', label: 'Buah', icon: '🍎' },
  { id: 'produk-kebun', label: 'Produk Kebun', icon: '🌱' },
  { id: 'kue', label: 'Kue & Jajanan', icon: '🧁' },
  { id: 'lainnya', label: 'Lainnya', icon: '📦' }
];

interface FormData {
  title: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  location: string;
}

export default function BukaLapakPage() {
  const router = useRouter();
  const toast = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    location: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    handleInputChange('category', categoryId);
  };

  // Generate AI description
  const handleGenerateAIDescription = async () => {
    if (images.length === 0) {
      toast.warning("Foto Diperlukan", "Silakan upload foto produk terlebih dahulu untuk analisis AI");
      return;
    }

    setIsGeneratingDescription(true);
    
    try {
      console.log('🤖 Starting AI analysis for product...');
      const analysisResult = await analyzeImages(images);
      
      // Update form with AI analysis results - using product_info from enhanced result
      const productInfo = analysisResult.product_info;
      
      console.log('✅ AI Analysis completed:', productInfo);
      
      setFormData(prev => ({
        ...prev,
        title: productInfo.title || prev.title,
        description: productInfo.description || prev.description,
        price: productInfo.suggested_price?.toString() || prev.price,
        category: productInfo.category || prev.category
      }));

      toast.success("Analisis AI Selesai", "Form telah diisi otomatis berdasarkan analisis foto produk");

    } catch (error: any) {
      console.error('❌ AI Analysis failed:', error);
      
      // Fallback: Generate intelligent description based on available data
      const intelligentDescription = generateIntelligentDescription(
        formData.title, 
        formData.category, 
        images
      );
      
      if (intelligentDescription && intelligentDescription !== formData.description) {
        setFormData(prev => ({
          ...prev,
          description: intelligentDescription
        }));
        
        toast.success("Deskripsi Diperbarui", "Deskripsi telah dibuat berdasarkan informasi yang tersedia");
      } else {
        toast.error("Analisis AI Gagal", error.message || "Silakan isi form secara manual");
      }
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // Intelligent description generator that works with or without product details
  const generateIntelligentDescription = (productName: string, category: string, images: File[]): string => {
    const imageCount = images.length;
    const hasProductName = productName.length > 0;
    const hasCategory = category.length > 0;
    
    // If no product name, generate generic but useful description
    if (!hasProductName) {
      return generateGenericDescription(category, imageCount);
    }
    
    // Enhanced product name analysis
    const nameWords = productName.toLowerCase().split(' ');
    
    // Characteristic detection
    const isOrganic = nameWords.some(word => ['organik', 'organic', 'alami', 'natural'].includes(word));
    const isFresh = nameWords.some(word => ['segar', 'fresh', 'baru', 'panen'].includes(word));
    const isPremium = nameWords.some(word => ['premium', 'super', 'grade', 'kualitas', 'pilihan', 'istimewa'].includes(word));
    const isHomemade = nameWords.some(word => ['rumahan', 'buatan', 'homemade', 'tradisional', 'authentic'].includes(word));
    const isLarge = nameWords.some(word => ['besar', 'jumbo', 'xl', 'large', 'giant'].includes(word));
    
    // Specific product type detection with more comprehensive keywords
    const productTypes = {
      rice: nameWords.some(word => ['beras', 'rice', 'padi'].includes(word)),
      vegetable: nameWords.some(word => ['sayur', 'kangkung', 'bayam', 'sawi', 'kubis', 'brokoli', 'wortel', 'kentang', 'bawang', 'tomat', 'timun'].includes(word)),
      fruit: nameWords.some(word => ['buah', 'jeruk', 'apel', 'mangga', 'pisang', 'anggur', 'pepaya', 'melon', 'semangka', 'strawberry', 'durian'].includes(word)),
      drink: nameWords.some(word => ['jus', 'juice', 'minuman', 'drink', 'kopi', 'teh', 'susu'].includes(word)),
      cake: nameWords.some(word => ['kue', 'cake', 'roti', 'cookies', 'donat', 'muffin', 'cupcake'].includes(word)),
      spice: nameWords.some(word => ['bumbu', 'rempah', 'cabai', 'merica', 'jahe', 'kunyit', 'kemiri', 'ketumbar'].includes(word)),
      meat: nameWords.some(word => ['daging', 'ayam', 'sapi', 'kambing', 'ikan', 'udang', 'cumi'].includes(word)),
      snack: nameWords.some(word => ['keripik', 'snack', 'cemilan', 'crackers', 'biskuit'].includes(word))
    };
    
    // Generate category-specific descriptions with intelligent analysis
    let description = '';
    
    if (!hasCategory) {
      // Generate description without category but with product name analysis
      if (productTypes.rice) {
        description = `${productName} ${isPremium ? 'kualitas premium dengan butiran pulen' : 'berkualitas tinggi'} ${isOrganic ? 'hasil pertanian organik' : 'yang sudah terpilih'}. ${isLarge ? 'Kemasan besar cocok untuk keluarga' : 'Cocok untuk kebutuhan sehari-hari'}.`;
      } else if (productTypes.vegetable) {
        description = `${productName} ${isFresh ? 'segar hasil panen terbaru' : 'berkualitas tinggi'} ${isOrganic ? 'tanpa pestisida berbahaya' : 'langsung dari petani'}. ${isPremium ? 'Grade A dengan nutrisi optimal' : 'Kaya vitamin dan mineral alami'}.`;
      } else if (productTypes.fruit) {
        description = `${productName} ${isFresh ? 'segar dan manis alami' : 'dengan tingkat kematangan sempurna'} ${isOrganic ? 'hasil pertanian organik' : 'pilihan terbaik'}. ${isLarge ? 'Ukuran jumbo dengan rasa istimewa' : 'Dipetik langsung untuk kesegaran optimal'}.`;
      } else if (productTypes.drink) {
        description = `${productName} ${isFresh ? 'segar tanpa pengawet' : 'berkualitas tinggi'} ${isOrganic ? 'dari bahan organik murni' : 'dengan cita rasa autentik'}. ${isPremium ? 'Formula premium yang menyegarkan' : 'Cocok untuk segala cuaca dan aktivitas'}.`;
      } else if (productTypes.cake) {
        description = `${productName} ${isHomemade ? 'buatan rumahan dengan resep rahasia' : 'yang lembut dan lezat'} ${isPremium ? 'menggunakan bahan premium' : 'dengan tekstur yang sempurna'}. ${isFresh ? 'Dibuat fresh setiap hari' : 'Cita rasa yang menggoda selera'}.`;
      } else if (productTypes.spice) {
        description = `${productName} ${isOrganic ? 'organik berkualitas tinggi' : 'asli dengan aroma khas'} ${isPremium ? 'grade premium' : 'yang memberikan cita rasa autentik'}. ${isHomemade ? 'Diproses tradisional untuk kemurnian' : 'Rahasia kelezatan masakan Anda'}.`;
      } else if (productTypes.meat) {
        description = `${productName} ${isFresh ? 'segar dan berkualitas tinggi' : 'pilihan terbaik'} ${isPremium ? 'grade premium' : 'dengan standar higienis'}. ${isLarge ? 'Potongan besar cocok untuk acara' : 'Cocok untuk berbagai olahan masakan'}.`;
      } else if (productTypes.snack) {
        description = `${productName} ${isHomemade ? 'buatan rumahan dengan resep rahasia' : 'yang renyah dan gurih'}. ${isPremium ? 'Menggunakan bahan-bahan premium' : 'Cemilan favorit yang cocok dinikmati kapan saja'} bersama keluarga dan teman.`;
      } else {
        description = `${productName} ${isPremium ? 'kualitas premium' : 'berkualitas tinggi'} ${isOrganic ? 'dengan standar organik' : 'dengan harga yang kompetitif'}. ${isHomemade ? 'Dibuat dengan perhatian detail' : 'Produk terpercaya'} untuk kebutuhan Anda.`;
      }
    } else {
      // Generate full description with both name and category
      switch (category) {
        case 'makanan-minuman':
          if (productTypes.cake) {
            const cakeVariations = [
              `${productName} yang dibuat dengan resep ${isHomemade ? 'turun temurun' : 'terpilih'} menggunakan bahan-bahan ${isOrganic ? 'organik' : 'berkualitas tinggi'}. Tekstur ${isPremium ? 'premium yang lembut' : 'lembut'} dengan cita rasa yang pas di lidah.`,
              `${productName} ${isFresh ? 'fresh dari oven' : 'berkualitas tinggi'} dengan ${isPremium ? 'bahan premium dan teknik khusus' : 'perpaduan rasa yang sempurna'}. ${isHomemade ? 'Dibuat dengan penuh cinta untuk kepuasan Anda' : 'Cocok untuk berbagai acara istimewa'}.`,
              `${productName} ${isLarge ? 'ukuran besar yang mengenyangkan' : 'dengan porsi yang pas'} dan ${isPremium ? 'kualitas rasa premium' : 'kelezatan yang tak terlupakan'}. ${isOrganic ? 'Bahan organik tanpa pengawet berbahaya' : 'Dibuat higienis dengan standar food grade'}.`
            ];
            description = cakeVariations[Math.floor(Math.random() * cakeVariations.length)];
          } else if (productTypes.drink) {
            const drinkVariations = [
              `${productName} ${isFresh ? 'segar tanpa pengawet' : 'berkualitas tinggi'} yang ${isOrganic ? 'dibuat dari buah organik pilihan' : 'kaya akan vitamin dan mineral'}. ${isPremium ? 'Formula premium yang menyegarkan' : 'Cocok untuk menjaga kesehatan dan memberikan energi'}.`,
              `${productName} ${isHomemade ? 'racikan rumahan dengan resep khusus' : 'dengan cita rasa autentik'} yang ${isFresh ? 'selalu fresh dan menyegarkan' : 'memberikan kepuasan tersendiri'}. ${isLarge ? 'Kemasan besar untuk kebutuhan keluarga' : 'Cocok dinikmati kapan saja'}.`,
              `${productName} ${isOrganic ? 'organic premium tanpa bahan kimia' : 'berkualitas tinggi dengan rasa natural'} yang ${isPremium ? 'diproduksi dengan teknologi modern' : 'cocok untuk gaya hidup sehat'}. Memberikan energi dan kesegaran optimal.`
            ];
            description = drinkVariations[Math.floor(Math.random() * drinkVariations.length)];
          } else {
            const foodVariations = [
              `${productName} ${isHomemade ? 'buatan rumahan' : 'berkualitas tinggi'} dengan cita rasa ${isPremium ? 'premium' : 'autentik'}. Dibuat menggunakan bahan-bahan ${isOrganic ? 'organik' : 'pilihan terbaik'}.`,
              `${productName} ${isFresh ? 'selalu fresh dan berkualitas' : 'dengan standar mutu tinggi'} yang ${isPremium ? 'menggunakan resep premium' : 'memiliki cita rasa khas'}. ${isLarge ? 'Porsi besar yang mengenyangkan' : 'Cocok untuk santapan istimewa'}.`
            ];
            description = foodVariations[Math.floor(Math.random() * foodVariations.length)];
          }
          break;
          
        case 'sayuran':
          const vegetableVariations = [
            `${productName} ${isFresh ? 'segar hasil panen terbaru' : 'berkualitas tinggi'} ${isOrganic ? 'yang ditanam secara organik tanpa pestisida berbahaya' : 'langsung dari petani lokal'}. Kaya akan nutrisi dan vitamin yang baik untuk kesehatan keluarga.`,
            `${productName} ${isPremium ? 'grade A dengan kualitas ekspor' : 'pilihan terbaik'} yang ${isFresh ? 'dipanen dalam kondisi optimal' : 'terjaga kesegarannya'}. ${isLarge ? 'Ukuran besar dengan nilai gizi tinggi' : 'Cocok untuk menu sehat keluarga'}.`,
            `${productName} ${isOrganic ? 'organik bersertifikat tanpa bahan kimia' : 'segar dari kebun petani'} dengan ${isPremium ? 'standar kualitas premium' : 'kandungan nutrisi yang optimal'}. Investasi terbaik untuk kesehatan Anda.`
          ];
          description = vegetableVariations[Math.floor(Math.random() * vegetableVariations.length)];
          break;
          
        case 'buah-buahan':
          const fruitVariations = [
            `${productName} ${isFresh ? 'segar dan manis alami' : 'pilihan terbaik'} ${isOrganic ? 'hasil pertanian organik' : 'dengan tingkat kematangan yang sempurna'}. ${isPremium ? 'Grade A dengan ukuran seragam' : 'Dipilih langsung untuk menjaga kualitas dan kesegaran'}.`,
            `${productName} ${isLarge ? 'ukuran jumbo dengan rasa istimewa' : 'dengan rasa manis natural'} yang ${isFresh ? 'dipetik langsung saat musim' : 'terjaga kesegarannya'}. ${isOrganic ? 'Tanpa pengawet atau bahan kimia tambahan' : 'Kaya vitamin dan antioksidan alami'}.`,
            `${productName} ${isPremium ? 'premium quality dengan aroma harum' : 'segar dengan kandungan vitamin tinggi'} yang ${isOrganic ? 'ditanam secara sustainable' : 'memberikan manfaat kesehatan optimal'}. Cocok untuk camilan sehat dan jus segar.`
          ];
          description = fruitVariations[Math.floor(Math.random() * fruitVariations.length)];
          break;
          
        case 'sembako':
          if (productTypes.rice) {
            const riceVariations = [
              `${productName} ${isPremium ? 'kualitas premium' : 'berkualitas tinggi'} ${isOrganic ? 'hasil pertanian organik' : 'dengan butiran yang pulen dan wangi'}. ${isLarge ? 'Kemasan besar cocok untuk keluarga besar' : 'Cocok untuk kebutuhan sehari-hari keluarga Indonesia'}.`,
              `${productName} ${isFresh ? 'hasil panen terbaru dengan kualitas terjaga' : 'dengan standar mutu tinggi'} yang ${isPremium ? 'memberikan nasi pulen sempurna' : 'cocok untuk berbagai olahan'}. ${isOrganic ? 'Bebas dari bahan kimia berbahaya' : 'Pilihan terbaik untuk keluarga sehat'}.`
            ];
            description = riceVariations[Math.floor(Math.random() * riceVariations.length)];
          } else {
            const groceryVariations = [
              `${productName} ${isPremium ? 'grade premium' : 'berkualitas tinggi'} untuk kebutuhan dapur sehari-hari. ${isLarge ? 'Kemasan ekonomis untuk penghematan' : 'Harga terjangkau dengan kualitas yang tidak mengecewakan'}.`,
              `${productName} ${isFresh ? 'selalu fresh dengan kualitas terjaga' : 'dengan standar mutu tinggi'} yang ${isPremium ? 'memberikan nilai lebih untuk keluarga' : 'cocok untuk berbagai keperluan masak'}. Tahan lama dan bergizi.`
            ];
            description = groceryVariations[Math.floor(Math.random() * groceryVariations.length)];
          }
          break;
          
        case 'snack-cemilan':
          const snackVariations = [
            `${productName} ${isHomemade ? 'buatan rumahan dengan resep rahasia' : 'yang renyah dan gurih'}. ${isPremium ? 'Menggunakan bahan-bahan premium' : 'Cemilan favorit yang cocok dinikmati kapan saja'} bersama keluarga dan teman.`,
            `${productName} ${isLarge ? 'kemasan family size untuk berbagi' : 'dengan porsi yang pas'} dan ${isFresh ? 'selalu fresh dan renyah' : 'tekstur yang sempurna'}. ${isOrganic ? 'Tanpa MSG dan pengawet berlebihan' : 'Cocok untuk segala usia dan kesempatan'}.`
          ];
          description = snackVariations[Math.floor(Math.random() * snackVariations.length)];
          break;
          
        case 'bumbu-rempah':
          const spiceVariations = [
            `${productName} ${isOrganic ? 'organik' : 'asli'} ${isPremium ? 'kualitas premium' : 'berkualitas tinggi'} ${isHomemade ? 'dengan proses tradisional' : 'yang memberikan aroma dan rasa autentik'}. Rahasia kelezatan masakan rumahan Anda.`,
            `${productName} ${isFresh ? 'fresh dengan aroma yang tajam' : 'dengan kemurnian tinggi'} yang ${isPremium ? 'diproduksi dengan standar premium' : 'memberikan cita rasa khas nusantara'}. ${isLarge ? 'Kemasan besar untuk kebutuhan rumah makan' : 'Cocok untuk berbagai resep masakan'}.`
          ];
          description = spiceVariations[Math.floor(Math.random() * spiceVariations.length)];
          break;
          
        case 'minuman':
          const beverageVariations = [
            `${productName} ${isFresh ? 'segar dan menyegarkan' : 'berkualitas tinggi'} ${isOrganic ? 'dari bahan-bahan organik pilihan' : 'yang cocok untuk melepas dahaga'}. ${isPremium ? 'Formula premium' : 'Memberikan energi'} untuk aktivitas sehari-hari.`,
            `${productName} ${isHomemade ? 'racikan rumahan dengan resep khusus' : 'dengan cita rasa unik'} yang ${isFresh ? 'selalu segar dan natural' : 'memberikan kepuasan optimal'}. ${isLarge ? 'Kemasan besar untuk kebutuhan keluarga' : 'Cocok dinikmati dalam segala cuaca'}.`
          ];
          description = beverageVariations[Math.floor(Math.random() * beverageVariations.length)];
          break;
          
        default:
          description = `${productName} ${isPremium ? 'kualitas premium' : 'berkualitas tinggi'} ${isOrganic ? 'dengan standar organik' : 'dengan harga yang kompetitif'}. ${isHomemade ? 'Dibuat dengan perhatian detail' : 'Produk terpercaya'} untuk kebutuhan Anda.`;
      }
    }
    
    // Add enhanced image-based insights
    if (imageCount >= 3) {
      const multiImageInsights = [
        ` Tersedia ${imageCount} foto detail untuk melihat kualitas produk dari berbagai sudut pandang.`,
        ` Dokumentasi lengkap dengan ${imageCount} gambar berkualitas tinggi untuk referensi Anda.`,
        ` Koleksi ${imageCount} foto jelas yang menampilkan kondisi dan detail produk secara komprehensif.`
      ];
      description += multiImageInsights[Math.floor(Math.random() * multiImageInsights.length)];
    } else if (imageCount === 2) {
      description += ` Disertai 2 foto berkualitas untuk memberikan gambaran yang jelas tentang produk.`;
    } else if (imageCount === 1) {
      description += ` Foto produk tersedia untuk melihat kualitas dan kondisi barang secara real.`;
    }
    
    // Add enhanced selling points based on analysis
    const getEnhancedSellingPoints = () => {
      const points = ['✅ Kualitas terjamin'];
      
      if (isFresh || category === 'sayuran' || category === 'buah-buahan') {
        points.push('✅ Kondisi segar');
      }
      if (isOrganic) {
        points.push('✅ Organik & aman');
      }
      if (isHomemade) {
        points.push('✅ Buatan rumahan');
      }
      if (isPremium) {
        points.push('✅ Grade premium');
      }
      if (isLarge) {
        points.push('✅ Ukuran jumbo');
      }
      
      // Add category-specific points
      if (productTypes.meat || productTypes.cake) {
        points.push('✅ Higienis & aman');
      }
      
      points.push('✅ Harga bersahabat');
      points.push('✅ Ready stock');
      points.push('✅ Respon cepat');
      
      return points.slice(0, 5); // Limit to 5 points
    };
    
    description += `\n\n${getEnhancedSellingPoints().join('\n')}`;
    
    // Add personalized call to action based on product analysis
    if (category === 'makanan-minuman' && (isHomemade || productTypes.cake)) {
      const cakeCallToActions = [
        '\n\nPesan sekarang selagi masih hangat! 🔥',
        '\n\nOrder sekarang, stok terbatas! 🍰',
        '\n\nBooking dulu sebelum kehabisan! 📞'
      ];
      description += cakeCallToActions[Math.floor(Math.random() * cakeCallToActions.length)];
    } else if (category === 'sayuran' || category === 'buah-buahan' || isFresh) {
      const freshCallToActions = [
        '\n\nStok terbatas, pesan sekarang! 🥬🍎',
        '\n\nSelagi fresh, buruan order! 🌱',
        '\n\nDipanen hari ini, pesan sekarang! 🌾'
      ];
      description += freshCallToActions[Math.floor(Math.random() * freshCallToActions.length)];
    } else if (isPremium || isOrganic) {
      const premiumCallToActions = [
        '\n\nKualitas premium, order sekarang! ⭐',
        '\n\nJangan sampai kehabisan! 💎',
        '\n\nSegera hubungi untuk pemesanan! 👑'
      ];
      description += premiumCallToActions[Math.floor(Math.random() * premiumCallToActions.length)];
    } else {
      const generalCallToActions = [
        '\n\nHubungi sekarang untuk pemesanan! 📱',
        '\n\nChat langsung untuk info lebih lanjut! 💬',
        '\n\nOrder sekarang juga! 🛒'
      ];
      description += generalCallToActions[Math.floor(Math.random() * generalCallToActions.length)];
    }
    
    return description;
  };

  // Generate generic but useful description when product name is not available
  const generateGenericDescription = (category: string, imageCount: number): string => {
    let description = '';
    
    if (category) {
      switch (category) {
        case 'makanan-minuman':
          const foodDescriptions = [
            'Hidangan lezat dengan cita rasa autentik yang menggugah selera. Dibuat dengan bahan-bahan berkualitas dan higienis.',
            'Kuliner spesial dengan resep terpilih yang memberikan kepuasan tersendiri. Cocok untuk berbagai acara dan kesempatan.',
            'Menu favorit dengan kelezatan yang tidak akan Anda lupakan. Proses pembuatan yang teliti menjamin kualitas rasa.'
          ];
          description = foodDescriptions[Math.floor(Math.random() * foodDescriptions.length)];
          break;
          
        case 'sayuran':
          const vegetableDescriptions = [
            'Sayuran hijau berkualitas prima langsung dari kebun petani lokal. Dipanen dalam kondisi segar untuk menjaga kandungan nutrisinya.',
            'Produk sayuran organik yang kaya vitamin dan mineral. Proses penanaman yang natural tanpa bahan kimia berbahaya.',
            'Sayuran segar pilihan dengan kualitas ekspor. Cocok untuk menu sehat keluarga dan berbagai resep masakan.'
          ];
          description = vegetableDescriptions[Math.floor(Math.random() * vegetableDescriptions.length)];
          break;
          
        case 'buah-buahan':
          const fruitDescriptions = [
            'Buah-buahan manis dengan tingkat kematangan optimal. Dipetik langsung saat musim untuk mendapatkan rasa terbaik.',
            'Buah segar berkualitas premium dengan kandungan vitamin tinggi. Cocok untuk camilan sehat dan jus alami.',
            'Produk buah pilihan dengan aroma harum dan rasa yang manis natural. Tanpa pengawet atau bahan kimia tambahan.'
          ];
          description = fruitDescriptions[Math.floor(Math.random() * fruitDescriptions.length)];
          break;
          
        case 'sembako':
          const groceryDescriptions = [
            'Kebutuhan pokok berkualitas tinggi untuk dapur rumah tangga. Produk terpilih dengan standar kualitas yang ketat.',
            'Bahan makanan essential dengan kemasan higienis dan terjaga kualitasnya. Cocok untuk stok kebutuhan harian.',
            'Produk sembako pilihan dengan harga ekonomis namun tidak mengurangi kualitas. Tahan lama dan bergizi.'
          ];
          description = groceryDescriptions[Math.floor(Math.random() * groceryDescriptions.length)];
          break;
          
        case 'snack-cemilan':
          const snackDescriptions = [
            'Cemilan renyah dengan tekstur yang pas dan rasa yang menggoda. Cocok untuk teman santai dan acara berkumpul.',
            'Camilan favorit dengan cita rasa unik yang tidak membosankan. Terbuat dari bahan-bahan berkualitas tanpa MSG berlebihan.',
            'Snack enak dengan kemasan praktis yang mudah dibawa kemana-mana. Cocok untuk segala usia dan kesempatan.'
          ];
          description = snackDescriptions[Math.floor(Math.random() * snackDescriptions.length)];
          break;
          
        case 'bumbu-rempah':
          const spiceDescriptions = [
            'Rempah-rempah asli dengan aroma khas yang memperkaya cita rasa masakan. Diproses secara tradisional untuk menjaga keaslian.',
            'Bumbu dapur berkualitas tinggi yang memberikan kelezatan istimewa pada setiap hidangan. Formula rahasia turun temurun.',
            'Rempah pilihan dengan kemurnian tinggi dan aroma yang tajam. Kunci utama kelezatan masakan nusantara.'
          ];
          description = spiceDescriptions[Math.floor(Math.random() * spiceDescriptions.length)];
          break;
          
        case 'minuman':
          const drinkDescriptions = [
            'Minuman segar yang menyegarkan dan memberikan energi. Terbuat dari bahan alami dengan rasa yang menyegarkan.',
            'Minuman berkualitas dengan kandungan nutrisi yang baik untuk tubuh. Cocok untuk menemani aktivitas sehari-hari.',
            'Beverage premium dengan cita rasa unik dan menyegarkan. Proses pembuatan higienis dengan standar food grade.'
          ];
          description = drinkDescriptions[Math.floor(Math.random() * drinkDescriptions.length)];
          break;
          
        default:
          const genericDescriptions = [
            'Produk berkualitas tinggi dengan standar mutu yang terjaga. Diproduksi dengan perhatian detail untuk kepuasan konsumen.',
            'Item pilihan dengan kualitas terbaik dan harga yang kompetitif. Cocok untuk berbagai kebutuhan dan preferensi.',
            'Produk terpercaya dengan reputasi yang baik di pasaran. Memberikan value terbaik untuk investasi Anda.'
          ];
          description = genericDescriptions[Math.floor(Math.random() * genericDescriptions.length)];
      }
    } else {
      const noCategoryDescriptions = [
        'Produk unggulan dengan kualitas premium yang sudah terbukti. Memberikan pengalaman berbelanja yang memuaskan.',
        'Item terpilih dengan standar kualitas internasional. Cocok untuk berbagai keperluan dan kebutuhan harian.',
        'Produk berkualitas dengan jaminan kepuasan pelanggan. Harga terjangkau dengan nilai yang sebanding.'
      ];
      description = noCategoryDescriptions[Math.floor(Math.random() * noCategoryDescriptions.length)];
    }
    
    // Add dynamic image-based insights
    if (imageCount >= 3) {
      const multiImageTexts = [
        ` Dokumentasi lengkap dengan ${imageCount} foto detail dari berbagai angle untuk referensi Anda.`,
        ` Tersedia ${imageCount} gambar berkualitas tinggi yang menampilkan produk secara komprehensif.`,
        ` Koleksi ${imageCount} foto jelas yang memperlihatkan detail dan kualitas produk dengan sempurna.`
      ];
      description += multiImageTexts[Math.floor(Math.random() * multiImageTexts.length)];
    } else if (imageCount === 2) {
      const twoImageTexts = [
        ' Disertai 2 foto berkualitas untuk memberikan gambaran yang jelas tentang produk.',
        ' Dokumentasi visual dengan 2 gambar detail untuk memudahkan Anda dalam memilih.',
        ' Tersedia 2 foto produk yang menampilkan kualitas dan kondisi barang dengan jelas.'
      ];
      description += twoImageTexts[Math.floor(Math.random() * twoImageTexts.length)];
    } else if (imageCount === 1) {
      const singleImageTexts = [
        ' Foto produk tersedia untuk melihat kualitas dan kondisi barang secara real.',
        ' Gambar berkualitas tinggi menampilkan produk dengan jelas dan detail.',
        ' Dokumentasi visual yang memperlihatkan kondisi asli produk dengan akurat.'
      ];
      description += singleImageTexts[Math.floor(Math.random() * singleImageTexts.length)];
    }
    
    // Add varied selling points based on category
    const getVariedSellingPoints = () => {
      const basePoints = ['✅ Kualitas terjamin', '✅ Harga bersahabat', '✅ Ready stock'];
      const categoryPoints = {
        'makanan-minuman': ['✅ Higiene terjaga', '✅ Rasa autentik', '✅ Bahan berkualitas'],
        'sayuran': ['✅ Segar alami', '✅ Tanpa pestisida', '✅ Nutrisi tinggi'],
        'buah-buahan': ['✅ Rasa manis natural', '✅ Vitamin tinggi', '✅ Tanpa pengawet'],
        'sembako': ['✅ Tahan lama', '✅ Kemasan aman', '✅ Standar SNI'],
        'snack-cemilan': ['✅ Renyah gurih', '✅ Kemasan praktis', '✅ Tanpa MSG berlebihan'],
        'bumbu-rempah': ['✅ Aroma khas', '✅ Kemurnian tinggi', '✅ Proses tradisional'],
        'minuman': ['✅ Menyegarkan', '✅ Higienis', '✅ Energi alami'],
        'default': ['✅ Respon cepat', '✅ Pengiriman aman', '✅ Layanan terpercaya']
      };
      
      const specificPoints = categoryPoints[category as keyof typeof categoryPoints] || categoryPoints.default;
      const randomSpecific = specificPoints.sort(() => 0.5 - Math.random()).slice(0, 2);
      
      return [...basePoints, ...randomSpecific].slice(0, 5);
    };
    
    description += `\n\n${getVariedSellingPoints().join('\n')}`;
    
    // Add varied call to action
    const callToActions = [
      '\n\nHubungi sekarang untuk pemesanan! 📱',
      '\n\nChat langsung untuk info lebih lanjut! 💬',
      '\n\nOrder sekarang juga! 🛒',
      '\n\nPesan langsung via WhatsApp! 📲',
      '\n\nTanya-tanya dulu juga boleh! 😊'
    ];
    description += callToActions[Math.floor(Math.random() * callToActions.length)];
    
    return description;
  };

  // Handle AI insight clicks
  const handleInsightClick = (insight: any) => {
    toast.info(insight.title, insight.description);
  };

  // Handle price recommendation selection
  const handlePriceSelect = (price: number) => {
    setFormData(prev => ({ ...prev, price: price.toString() }));
    toast.success('Harga Dipilih', `Harga produk diubah menjadi ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)}`);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Nama produk wajib diisi';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi produk wajib diisi';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Harga wajib diisi';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Harga harus berupa angka yang valid';
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'Stok wajib diisi';
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) <= 0) {
      newErrors.stock = 'Stok harus berupa angka yang valid';
    }

    if (!selectedCategory) {
      newErrors.category = 'Kategori wajib dipilih';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi wajib diisi';
    }

    if (images.length === 0) {
      toast.warning('Foto Produk Diperlukan', 'Mohon unggah setidaknya satu foto produk untuk melanjutkan');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    toast.info('Menyimpan Produk', 'Sedang menambahkan produk ke lapak Anda...');

    try {
      // Prepare lapak data for API
      const lapakData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        unit: 'pcs', // Default unit, could be made configurable
        stock_quantity: Number(formData.stock)
      };
      
      // Create lapak using service
      const newLapak = await createLapak(lapakData, images);
      
      toast.success('Produk Berhasil Ditambahkan!', `Produk "${newLapak.title}" telah tersedia di lapak dan dapat dilihat oleh tetangga.`);
      
      // Delay before navigation to show success message
      setTimeout(() => {
        router.push('/lapak');
      }, 1500);
    } catch (error) {
      console.error('Error creating lapak:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan. Silakan periksa koneksi dan coba lagi.';
      toast.error('Gagal Menambahkan Produk', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="page-padding py-4u">
          <div className="flex items-center gap-3u">
            <Button
              variant="ghost"
              size="small"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-heading-1 font-bold text-primary">
                Buka Lapak
              </h1>
              <p className="text-caption text-text-secondary">
                Tambahkan produk baru ke lapak Anda
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="page-padding py-4u">
        <form onSubmit={handleSubmit} className="space-y-6u max-w-2xl mx-auto">
          {/* Image Upload Section */}
          <div className="card p-4u">
            <div className="flex items-center gap-2u mb-3u">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="text-heading-2 font-semibold">Foto Produk</h2>
            </div>
            <ImageUploader
              onImagesChange={setImages}
              maxImages={5}
              disabled={isSubmitting}
            />
          </div>

          {/* AI Insights Section */}
          {images.length > 0 && (
            <AIInsights
              images={images}
              productName={formData.title}
              description={formData.description}
              onInsightClick={handleInsightClick}
            />
          )}

          {/* Product Details Section */}
          <div className="card p-4u">
            <div className="flex items-center gap-2u mb-4u">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-heading-2 font-semibold">Detail Produk</h2>
            </div>

            <div className="space-y-4u">
              {/* Product Name */}
              <div>
                <label className="block text-body-large font-medium text-text-primary mb-2u">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={cn(
                    'input-field',
                    errors.title && 'input-error'
                  )}
                  placeholder="Contoh: Sayur Bayam Segar"
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-caption text-error mt-1u">{errors.title}</p>
                )}
              </div>

              {/* AI Description Generator */}
              <div className="mb-6u">
                <button
                  type="button"
                  onClick={handleGenerateAIDescription}
                  disabled={isGeneratingDescription || images.length === 0}
                  className={cn(
                    'w-full px-4u py-3u rounded-button border border-dashed transition-all duration-200',
                    isGeneratingDescription || images.length === 0
                      ? 'border-border bg-surface-secondary text-text-secondary cursor-not-allowed'
                      : 'border-accent bg-accent/5 text-accent hover:bg-accent/10'
                  )}
                >
                  <div className="flex items-center justify-center gap-2u">
                    {isGeneratingDescription ? (
                      <>
                        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <span>Menganalisis dengan AI...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span>Analisis Produk dengan AI</span>
                      </>
                    )}
                  </div>
                  <p className="text-caption text-text-secondary mt-1u">
                    {images.length === 0 ? 'Upload foto produk terlebih dahulu' : 'AI Google Gemini akan menganalisis foto dan mengisi form otomatis'}
                  </p>
                </button>
              </div>

              {/* Description with AI Feature */}
              <div>
                <div className="flex items-center justify-between mb-2u">
                  <label className="text-body-large font-medium text-text-primary">
                    Deskripsi *
                  </label>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={cn(
                    'input-field min-h-24',
                    errors.description && 'input-error'
                  )}
                  placeholder="Deskripsikan produk Anda dengan detail..."
                  rows={4}
                  disabled={isSubmitting || isGeneratingDescription}
                />
                {errors.description && (
                  <p className="text-caption text-error mt-1u">{errors.description}</p>
                )}
                <p className="text-caption text-text-secondary mt-1u">
                  ✨ Gunakan fitur AI untuk menganalisis foto dan mengisi form otomatis (nama, deskripsi, harga, kategori)
                </p>
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4u">
                <div>
                  <label className="block text-body-large font-medium text-text-primary mb-2u">
                    <DollarSign className="h-4 w-4 inline mr-1u" />
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={cn(
                      'input-field',
                      errors.price && 'input-error'
                    )}
                    placeholder="15000"
                    min="0"
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="text-caption text-error mt-1u">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-body-large font-medium text-text-primary mb-2u">
                    Stok *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    className={cn(
                      'input-field',
                      errors.stock && 'input-error'
                    )}
                    placeholder="10"
                    min="1"
                    disabled={isSubmitting}
                  />
                  {errors.stock && (
                    <p className="text-caption text-error mt-1u">{errors.stock}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Price Recommendation Section */}
          {formData.title && selectedCategory && (
            <PriceRecommendation
              productName={formData.title}
              category={selectedCategory}
              description={formData.description}
              currentPrice={formData.price}
              onPriceSelect={handlePriceSelect}
            />
          )}

          {/* Category Section */}
          <div className="card p-4u">
            <div className="flex items-center gap-2u mb-4u">
              <Tag className="h-5 w-5 text-primary" />
              <h2 className="text-heading-2 font-semibold">Kategori</h2>
            </div>

            <div className="flex flex-wrap gap-2u">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                  disabled={isSubmitting}
                  className={cn(
                    'flex items-center gap-2u px-3u py-2u rounded-button border transition-all duration-200',
                    'hover:border-primary hover:bg-primary/5',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                    selectedCategory === category.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-surface text-text-secondary'
                  )}
                >
                  <span>{category.icon}</span>
                  <span className="text-body-small">{category.label}</span>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-caption text-error mt-2u">{errors.category}</p>
            )}
          </div>

          {/* Location Section */}
          <div className="card p-4u">
            <div className="flex items-center gap-2u mb-3u">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-heading-2 font-semibold">Lokasi</h2>
            </div>

            <div>
              <label className="block text-body-large font-medium text-text-primary mb-2u">
                Alamat/Lokasi Pickup *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={cn(
                  'input-field',
                  errors.location && 'input-error'
                )}
                placeholder="Contoh: Jl. Kenangan No. 15, RT 02/RW 05"
                disabled={isSubmitting}
              />
              {errors.location && (
                <p className="text-caption text-error mt-1u">{errors.location}</p>
              )}
              <p className="text-caption text-text-secondary mt-1u">
                Berikan alamat yang jelas agar pembeli mudah menemukan lokasi Anda
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3u">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Menyimpan...' : 'Tambah ke Lapak'}
            </Button>
          </div>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toast.toasts}
        onRemove={toast.removeToast}
      />
    </div>
  );
} 