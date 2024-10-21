'use client';
import React from 'react'

import { ReactNode } from 'react';

export default function Bold({ children }: { children: ReactNode }) {
    return <strong className="font-bold">{children}</strong>
}