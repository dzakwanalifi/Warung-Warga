'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, MapPin, Clock, ShoppingCart, AlertCircle, CheckCircle, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { getMockBoronganDetail, type BoronganDetail } from '@/lib/boronganService';
import { OrganizerInfo } from '@/components/OrganizerInfo';
import { ParticipantsVisualization } from '@/components/ParticipantsVisualization';
import { Timeline } from '@/components/Timeline';
import { CountdownTimer } from '@/components/CountdownTimer';
import { DetailPageSkeleton } from '@/components/DetailPageSkeleton';

interface BoronganDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BoronganDetailPage({ params }: BoronganDetailPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [borongan, setBorongan] = useState<BoronganDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // Extract id from params promise
    const extractId = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    
    extractId();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    
    // Load borongan detail data
    const loadBoronganDetail = async () => {
      try {
        setLoading(true);
        // For MVP, using mock data
        const detail = getMockBoronganDetail(id);
        setBorongan(detail);
      } catch (error) {
        console.error('Error loading borongan detail:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBoronganDetail();
  }, [id]);

  const handleJoinBorongan = async () => {
    if (!borongan) return;
    
    setIsJoining(true);
    try {
      // TODO: Implement actual join API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // For now, just show success message
      alert('Berhasil bergabung ke borongan!');
      
      // Refresh data
      const detail = getMockBoronganDetail(id);
      setBorongan(detail);
    } catch (error) {
      console.error('Error joining borongan:', error);
      alert('Gagal bergabung ke borongan. Silakan coba lagi.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCountdownExpire = () => {
    if (borongan) {
      setBorongan({
        ...borongan,
        status: 'cancelled'
      });
    }
  };

  if (loading) {
    return <DetailPageSkeleton />;
  }

  if (!borongan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Borongan Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Borongan yang Anda cari mungkin sudah tidak tersedia.</p>
          <Button onClick={() => router.back()}>
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = (borongan.current_quantity / borongan.target_quantity) * 100;
  const isTargetReached = borongan.current_quantity >= borongan.target_quantity;
  const potentialSavings = borongan.original_price_per_unit 
    ? (borongan.original_price_per_unit - borongan.price_per_unit) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="small"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900 truncate">{borongan.title}</h1>
              <p className="text-sm text-gray-600">{borongan.location}</p>
            </div>
            <Badge 
              variant={borongan.status === 'active' ? 'default' : 'secondary'}
              className="shrink-0"
            >
              {borongan.status === 'active' ? 'Aktif' : 
               borongan.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <Image
                    src={borongan.images[selectedImage]}
                    alt={borongan.title}
                    fill
                    className="object-cover"
                    priority={selectedImage === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  />
                  {borongan.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {borongan.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={cn(
                            "w-12 h-8 rounded border-2 overflow-hidden",
                            selectedImage === index ? "border-white" : "border-transparent opacity-60"
                          )}
                        >
                          <Image
                            src={borongan.images[index]}
                            alt={`${borongan.title} ${index + 1}`}
                            width={48}
                            height={32}
                            className="object-cover w-full h-full"
                            loading="lazy"
                            sizes="48px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Informasi Produk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{borongan.title}</h3>
                  <p className="text-gray-600">{borongan.description}</p>
                </div>

                {/* Price Information */}
                <div className="bg-success/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-success">
                        {formatPrice(borongan.price_per_unit)}
                      </p>
                      <p className="text-sm text-text-secondary">per unit</p>
                      {borongan.original_price_per_unit && (
                        <p className="text-sm text-text-secondary line-through">
                          {formatPrice(borongan.original_price_per_unit)}
                        </p>
                      )}
                    </div>
                    {potentialSavings > 0 && (
                      <div className="text-right">
                        <p className="text-lg font-semibold text-success">
                          Hemat {formatPrice(potentialSavings)}
                        </p>
                        <p className="text-sm text-text-secondary">per unit</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Lokasi Pengambilan</p>
                    <p className="text-gray-600">{borongan.pickup_location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Penyelenggara
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrganizerInfo
                  organizerId={borongan.organizer.id}
                  organizerName={borongan.organizer.name}
                  organizerAvatar={borongan.organizer.avatar}
                  isVerified={borongan.organizer.is_verified}
                  rating={borongan.organizer.rating}
                  totalBoronganCreated={borongan.organizer.total_borongan_created}
                />
              </CardContent>
            </Card>

            {/* Terms & Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Syarat & Ketentuan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {borongan.terms_conditions.map((term, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span className="text-sm text-text-secondary">{term}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Timeline 
              items={borongan.timeline} 
              className="lg:hidden" // Show on mobile only
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Countdown Timer */}
            {borongan.status === 'active' && (
              <Card>
                <CardContent className="p-4">
                  <CountdownTimer 
                    deadline={borongan.deadline}
                    onExpire={handleCountdownExpire}
                  />
                </CardContent>
              </Card>
            )}

            {/* Progress & Join */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Status Borongan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">
                      {borongan.current_quantity}/{borongan.target_quantity}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(progressPercentage)}% tercapai
                  </p>
                </div>

                {/* Participants Visualization */}
                <ParticipantsVisualization
                  participants={borongan.participants}
                  maxParticipants={borongan.target_quantity}
                />

                {/* Join Button */}
                {borongan.status === 'active' && !isTargetReached && (
                  <Button
                    onClick={handleJoinBorongan}
                    disabled={isJoining}
                    className="w-full"
                    size="large"
                  >
                    {isJoining ? 'Bergabung...' : 'Bergabung Sekarang'}
                  </Button>
                )}

                {isTargetReached && (
                  <div className="bg-success/10 rounded-lg p-3 text-center">
                    <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
                    <p className="text-sm font-medium text-success">
                      Target Tercapai!
                    </p>
                    <p className="text-xs text-success">
                      Menunggu proses pemesanan
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline - Desktop Only */}
            <div className="hidden lg:block">
              <Timeline items={borongan.timeline} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 