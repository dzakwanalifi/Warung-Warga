'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

interface ParticipantsVisualizationProps {
  participants: Participant[];
  maxParticipants: number;
  className?: string;
}

export const ParticipantsVisualization: React.FC<ParticipantsVisualizationProps> = ({
  participants,
  maxParticipants,
  className
}) => {
  const emptySlots = Math.max(0, maxParticipants - participants.length);

  return (
    <div className={cn('card p-4u', className)}>
      <div className="mb-3u">
        <h3 className="text-body-large font-medium text-text-primary mb-1u">
          Peserta Borongan
        </h3>
        <p className="text-body-small text-text-secondary">
          {participants.length} dari {maxParticipants} peserta bergabung
        </p>
      </div>

      {/* Participants Grid */}
      <div className="flex flex-wrap gap-2u">
        {/* Existing Participants */}
        {participants.map((participant, index) => (
          <div key={participant.id} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-surface-secondary overflow-hidden border-2 border-primary/20">
              {participant.avatar ? (
                <img 
                  src={participant.avatar} 
                  alt={participant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-caption text-text-secondary mt-1u max-w-16 text-center truncate">
              {participant.name}
            </span>
          </div>
        ))}

        {/* Empty Slots */}
        {Array.from({ length: emptySlots }, (_, index) => (
          <div key={`empty-${index}`} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-border bg-surface-secondary flex items-center justify-center">
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-caption text-text-secondary mt-1u">
              Slot kosong
            </span>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      {participants.length > 0 && (
        <div className="mt-4u">
          <div className="flex items-center justify-between mb-1u">
            <span className="text-caption text-text-secondary">Progress peserta</span>
            <span className="text-caption font-medium text-primary">
              {Math.round((participants.length / maxParticipants) * 100)}%
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(participants.length / maxParticipants) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 