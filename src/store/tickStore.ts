import { KLineData, Nullable } from 'klinecharts';
import { createSignal } from 'solid-js';

export const [currenttick, setCurrentTick] = createSignal<Nullable<KLineData>>(null);
