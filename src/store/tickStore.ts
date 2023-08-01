import { KLineData, Nullable } from 'klinecharts';
import { createSignal } from 'solid-js';

// export const useTick = () => {
export const [currenttick, setCurrentTick] = createSignal<Nullable<KLineData>>(null);

//   const updateCurrentTick = (value: Nullable<KLineData>) => {
//     setCurrentTick(value);
//   };

//   return { currenttick, updateCurrentTick };
// };