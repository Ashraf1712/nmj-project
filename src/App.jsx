import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  ChevronRight,
  CheckCircle,
  Info,
  Zap,
  Activity,
  Microscope,
  ArrowRight,
  Settings,
  Moon,
  Sun,
  Sliders,
} from "lucide-react";


// --- CONSTANTS & TEXT DATA (Strictly following prompt) ---


const COLORS = {
  motorNeuron: "#9333ea", // Purple-600
  motorNeuronFill: "#e9d5ff", // Purple-200
  vesicle: "#93c5fd", // Blue-300
  ach: "#facc15", // Yellow-400 (Glowing)
  calcium: "#22c55e", // Green-500
  sodium: "#f9a8d4", // Pink-300
  sarcolemma: "#f472b6", // Pink-400
  sarcoplasm: "#eff6ff", // Blue-50
  sr: "#3b82f6", // Blue-500
  actin: "#fca5a5", // Red-300
  myosin: "#b91c1c", // Red-700
  atp: "#fbbf24", // Amber-400
};


const LEVEL_1_DATA = [
  {
    id: "terminal",
    label: "Synaptic Terminal",
    text: "Contains synaptic vesicles filled with acetylcholine.",
  },
  {
    id: "vesicles",
    label: "Synaptic Vesicles",
    text: "Sacs containing neurotransmitter which is acetylcholine.",
  },
  {
    id: "cleft",
    label: "Synaptic Cleft",
    text: "Gap between synaptic terminal and motor end plate.",
  },
  {
    id: "plate",
    label: "Motor End Plate",
    text: "Sarcolemma of muscle fibre with junctional folds and ligand-gated ion channels.",
  },
];


const LEVEL_2_STEPS = [
  {
    id: 0,
    title: "Resting State",
    text: "Neuron is at rest. Ready for impulse.",
  },
  {
    id: 1,
    title: "Step 1: Action Potential",
    text: "The arrival of an action potential at the axon terminal depolarizes the presynaptic membrane and opens voltage-gated calcium channel.",
  },
  {
    id: 2,
    title: "Step 2: Influx of Calcium",
    text: "Triggering an influx of calcium ions into the presynaptic membrane and causes some synaptic vesicle containing acetylcholine to fuse with the presynaptic membrane.",
  },
  {
    id: 3,
    title: "Step 3: Vesicle Fusion",
    text: "Synaptic vesicles release acetylcholine into synaptic cleft by exocytosis.",
  },
  {
    id: 4,
    title: "Step 4: Binding",
    text: "Acetylcholine diffuses across the synaptic cleft and binds to a specific receptor on ligand-gated ion channel on sarcolemma.",
  },
  {
    id: 5,
    title: "Step 5: Depolarization",
    text: "Triggers opening ligand-gated ion channels, allowing Na⁺ inflow into the muscle fiber. This leads to a depolarization of the muscle fibre and triggers an action potential in muscle fibre.",
  },
  {
    id: 6,
    title: "Step 6: Propagation",
    text: "Action potential travels along sarcolemma and down T-tubules.",
  },
  {
    id: 7,
    title: "Step 7: Calcium Release",
    text: "Action potential reaches sarcoplasmic reticulum and triggers voltage-gated Ca²⁺ channels to open. Ca²⁺ released from sarcoplasmic reticulum into sarcoplasm.",
  },
];


const SARCOMERE_ZONES = [
  { id: "z-line", label: "Z Line", text: "Boundary of the sarcomere." },
  {
    id: "m-line",
    label: "M Line",
    text: "Central supporting protein structure.",
  },
  {
    id: "h-zone",
    label: "H Zone",
    text: "Region containing only thick filaments.",
  },
  {
    id: "i-band",
    label: "I Band",
    text: "Region containing only thin filaments.",
  },
  {
    id: "a-band",
    label: "A Band",
    text: "Region of overlapping thick and thin filaments.",
  },
];


const SFT_STEPS = [
  {
    step: 1,
    label: "Step 1: Resting State",
    text: "At rest, tropomyosin blocks the myosin binding sites on actin filament.",
  },
  {
    step: 2,
    label: "Step 2: Excitation",
    text: "When the action potential propagates along the plasma membrane and down the T- tubules, it triggers voltage-gated Ca2+ channels to open and Ca2+ release from the sarcoplasmic reticulum into the sarcoplasm.",
  },
  {
    step: 3,
    label: "Step 3: Calcium Binding",
    text: "Ca²⁺ bind to the troponin complex.",
  },
  {
    step: 4,
    label: "Step 4: Active Site Exposure",
    text: "Troponin complex changes its conformation. Pushing away the tropomyosin from the myosin binding site and exposed the myosin binding sites on actin filament.",
  },
  {
    step: 5,
    label: "Step 5: ATP Binding",
    text: "At thick filament, ATP is bound to the myosin head, which is in low energy configuration.",
  },
  {
    step: 6,
    label: "Step 6: Hydrolysis",
    text: "Each myosin head containing the enzyme ATPase, which catalyzes the hydrolysis of ATP to ADP and inorganic phosphate (Pi), energy is released.",
  },
  {
    step: 7,
    label: "Step 7: High Energy",
    text: "Now, the myosin head is in high energy configuration.",
  },
  {
    step: 8,
    label: "Step 8: Cross-bridge",
    text: "Myosin head binds to the exposed myosin binding site on actin filament forming cross-bridge.",
  },
  {
    step: 9,
    label: "Step 9: Release",
    text: "Myosin head releases ADP + Pi and it returns to low energy configuration, sliding the actin (thin) filament toward the center of sarcomere or H zone.",
  },
  {
    step: 10,
    label: "Step 10: Power Stroke",
    text: "The myosin head bends (by an angle of 45°) creating a Power stroke that pulls the actin filament towards the center of the sarcomere.",
  },
  {
    step: 11,
    label: "Step 11: Contraction",
    text: "Muscle contract. Shorten the H zone and I band.",
  },
  {
    step: 12,
    label: "Step 12: Detachment",
    text: "Binding of new ATP detaches the myosin head from actin and a new cycle begins.",
  },
  {
    step: 13,
    label: "Step 13: Ca²⁺ Pump",
    text: "When action potential ends, Ca²⁺ are pumped back into the sarcoplasmic reticulum by active transport (use ATP).",
  },
  {
    step: 14,
    label: "Step 14: Decrease",
    text: "The concentration of Ca²⁺ in sarcoplasm decreases.",
  },
  {
    step: 15,
    label: "Step 15: Relaxation",
    text: "The myosin-binding sites on actin are blocked again by tropomyosin. The actin filaments slide back to their original position, the muscle relaxes.",
  },
];


const RELAXATION_TEXT =
  "When action potential ends, Ca²⁺ are pumped back into the sarcoplasmic reticulum by active transport (use ATP). The concentration of Ca²⁺ in sarcoplasm decreases. The myosin-binding sites on actin are blocked again by tropomyosin. The actin filaments slide back to their original position, the muscle relaxes.";


// --- HELPER COMPONENTS ---


const Button = ({ onClick, children, disabled, className = "" }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-bold shadow-md transition-colors ${disabled
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-indigo-600 text-white hover:bg-indigo-700"
      } ${className}`}
  >
    {children}
  </motion.button>
);


const InfoBox = ({ title, text }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-4 rounded-xl border-l-4 border-indigo-500 shadow-lg mt-4 min-h-[100px]"
  >
    <h3 className="font-bold text-indigo-700 dark:text-indigo-300 text-lg mb-1">
      {title}
    </h3>
    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{text}</p>
  </motion.div>
);


const Particles = ({ count, color, cx, cy, active, targetY, delay = 0 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={i}
          r={3}
          fill={color}
          initial={{ cx: cx + i * 10 - count * 5, cy: cy, opacity: 0 }}
          animate={
            active
              ? {
                cy: targetY,
                opacity: 1,
                transition: {
                  duration: 1.5,
                  delay: delay + i * 0.1,
                  ease: "easeInOut",
                },
              }
              : { opacity: 0 }
          }
        />
      ))}
    </>
  );
};


// --- LEVELS ---


// LEVEL 1: Structure of NMJ
const Level1 = ({ onComplete }) => {
  const [selected, setSelected] = useState(null);
  const [visited, setVisited] = useState(new Set());


  const handleSelect = (id) => {
    setSelected(id);
    const newVisited = new Set(visited).add(id);
    setVisited(newVisited);
    if (newVisited.size === 4) {
      setTimeout(onComplete, 1000);
    }
  };


  const getHighlight = (id) =>
    selected === id
      ? "stroke-yellow-400 stroke-[3px] filter drop-shadow-lg"
      : "stroke-none";


  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
        <svg viewBox="0 0 600 400" className="w-full h-full cursor-pointer">
          {/* Motor Neuron Terminal (Distinct Synaptic Bouton Shape) */}
          <motion.path
            d="M 280,0 L 280,100 C 280,160 180,160 180,220 Q 180,280 300,280 Q 420,280 420,220 C 420,160 320,160 320,100 L 320,0 Z"
            fill={COLORS.motorNeuronFill}
            stroke={COLORS.motorNeuron}
            strokeWidth="3"
            className={getHighlight("terminal")}
            onClick={() => handleSelect("terminal")}
            whileHover={{ fill: "#d8b4fe" }}
          />


          {/* Synaptic Vesicles (Repositioned inside the bulb) */}
          <g
            onClick={() => handleSelect("vesicles")}
            className="cursor-pointer"
          >
            {/* Vesicle 1 */}
            <circle
              cx="260"
              cy="210"
              r="16"
              fill={COLORS.vesicle}
              className={getHighlight("vesicles")}
            />
            <circle
              cx="256"
              cy="206"
              r="3"
              fill={COLORS.ach}
              className="pointer-events-none"
            />
            <circle
              cx="264"
              cy="206"
              r="3"
              fill={COLORS.ach}
              className="pointer-events-none"
            />
            <circle
              cx="260"
              cy="214"
              r="3"
              fill={COLORS.ach}
              className="pointer-events-none"
            />


            {/* Vesicle 2 */}
            <circle
              cx="340"
              cy="210"
              r="16"
              fill={COLORS.vesicle}
              className={getHighlight("vesicles")}
            />
            <circle
              cx="336"
              cy="206"
              r="3"
              fill={COLORS.ach}
              className="pointer-events-none"
            />
            <circle
              cx="344"
              cy="206"
              r="3"
              fill={COLORS.ach}
              className="pointer-events-none"
            />
            <circle
              cx="340"
              cy="214"
              r="3"
              fill={COLORS.ach}
              className="pointer-events-none"
            />


            {/* Vesicle 3 */}
            <circle
              cx="300"
              cy="240"
              r="16"
              fill={COLORS.vesicle}
              className={getHighlight("vesicles")}
            />
            <circle
              cx="296"
              cy="236"
              r="3"
              fill={COLORS.ach}
              className="pointer-events-none"
            />
            <circle
              cx="304"
              cy="236"
              r="3"
              fill={COLORS.ach}
              className="pointer-events-none"
            />
            <circle
              cx="300"
              cy="244"
              r="3"
              fill={COLORS.ach}
              className="pointer-events-none"
            />
          </g>


          {/* Motor End Plate / Sarcolemma */}
          <motion.path
            d="M 0,310 L 150,310 Q 200,310 200,360 Q 220,310 240,360 Q 260,310 300,360 Q 340,310 360,360 Q 380,310 400,360 Q 450,310 600,310 L 600,400 L 0,400 Z"
            fill="#fbcfe8" // light pink
            stroke={COLORS.sarcolemma}
            strokeWidth="4"
            className={getHighlight("plate")}
            onClick={() => handleSelect("plate")}
            whileHover={{ fill: "#f9a8d4" }}
          />


          {/* Synaptic Cleft (Adjusted for new gap) */}
          <rect
            x="180"
            y="280"
            width="240"
            height="30"
            fill="transparent"
            className={getHighlight("cleft")}
            onClick={() => handleSelect("cleft")}
          />


          {/* Labels for visualization */}
          <text
            x="300"
            y="50"
            textAnchor="middle"
            fill={COLORS.motorNeuron}
            className="text-xs font-bold pointer-events-none"
          >
            Axon
          </text>
          <text
            x="500"
            y="350"
            textAnchor="middle"
            fill="#be185d"
            className="text-xs font-bold pointer-events-none"
          >
            Muscle Fibre
          </text>
        </svg>


        {/* Labels Overlay */}
        <div className="absolute top-4 left-4 bg-white/80 dark:bg-slate-800/80 p-2 rounded shadow text-sm">
          Click structures to identify them ({visited.size}/4)
        </div>
      </div>


      <InfoBox
        title={
          selected
            ? LEVEL_1_DATA.find((d) => d.id === selected).label
            : "Explore the NMJ"
        }
        text={
          selected
            ? LEVEL_1_DATA.find((d) => d.id === selected).text
            : "Click on the Neuron, Vesicles, Cleft, or Motor End Plate to learn about them."
        }
      />
    </div>
  );
};


// LEVEL 2: Transmission of Impulse
const Level2 = ({ onComplete, onQuizStart }) => {
  const [step, setStep] = useState(0);


  const nextStep = () => {
    if (step < 7) setStep(step + 1);
    else {
      onQuizStart();
      setTimeout(onComplete, 2000);
    }
  };


  const reset = () => setStep(0);


  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
        <svg viewBox="0 0 600 400" className="w-full h-full">
          {/* Background/Sarcoplasm */}
          <rect
            x="0"
            y="310"
            width="600"
            height="90"
            fill={step >= 5 ? "#fed7aa" : "#fff1f2"}
            className="transition-colors duration-1000"
          />


          {/* Neuron Terminal (Consistent Shape with Level 1) */}
          <motion.path
            d="M 280,-50 L 280,100 C 280,160 180,160 180,220 Q 180,280 300,280 Q 420,280 420,220 C 420,160 320,160 320,100 L 320,-50 Z"
            fill={COLORS.motorNeuronFill}
            stroke={COLORS.motorNeuron}
            strokeWidth="3"
            animate={
              step === 1
                ? { stroke: "#fbbf24", strokeWidth: 5, fill: "#f3e8ff" }
                : {
                  stroke: COLORS.motorNeuron,
                  strokeWidth: 3,
                  fill: COLORS.motorNeuronFill,
                }
            }
          />


          {/* Action Potential Depolarization Charges (Step 1) */}
          {step === 1 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {[
                // Neck Left (Fixed to be INSIDE the neck x=280-300)
                { x: 290, y: 10 },
                { x: 290, y: 50 },
                { x: 290, y: 90 },
                // Neck Right (Fixed to be INSIDE the neck x=300-320)
                { x: 310, y: 10 },
                { x: 310, y: 50 },
                { x: 310, y: 90 },
                // Bulb Left Curve
                { x: 250, y: 140 },
                { x: 210, y: 180 },
                { x: 195, y: 220 },
                // Bulb Right Curve
                { x: 350, y: 140 },
                { x: 390, y: 180 },
                { x: 405, y: 220 },
                // Bottom
                { x: 240, y: 265 },
                { x: 360, y: 265 },
              ].map((pos, i) => (
                <motion.text
                  key={i}
                  x={pos.x}
                  y={pos.y}
                  fill="#fbbf24"
                  fontSize="18"
                  fontWeight="bold"
                  textAnchor="middle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  +
                </motion.text>
              ))}
            </motion.g>
          )}


          {/* Voltage Gated Ca Channels (Repositioned for new bulb shape) */}
          <rect
            x="170"
            y="200"
            width="15"
            height="40"
            rx="3"
            fill="#64748b"
            transform="rotate(-10 177 220)"
          />
          {/* Label for Left Channel */}
          <text x="80" y="195" fill="#475569" className="text-[10px] font-bold">
            Voltage-gated
          </text>
          <text x="80" y="207" fill="#475569" className="text-[10px] font-bold">
            Ca²⁺ Channel
          </text>
          {/* Line pointing to channel */}
          <line
            x1="160"
            y1="200"
            x2="175"
            y2="210"
            stroke="#94a3b8"
            strokeWidth="1"
          />


          <rect
            x="415"
            y="200"
            width="15"
            height="40"
            rx="3"
            fill="#64748b"
            transform="rotate(10 422 220)"
          />


          {/* Ca2+ Ions Animation (Entering through channels) */}
          <text
            x="120"
            y="235"
            fill={COLORS.calcium}
            className="text-sm font-bold"
          >
            Ca²⁺
          </text>


          {/* Left Channel Influx - Explicit path through channel */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.circle
              key={`ca-left-${i}`}
              r={4}
              fill={COLORS.calcium}
              initial={{ cx: 140, cy: 190 + i * 5, opacity: 0 }}
              animate={
                step >= 2
                  ? {
                    cx: [140, 175, 220], // Path: Outside -> Through Channel -> Inside Bulb
                    cy: [190 + i * 5, 210, 240 + i * 8],
                    opacity: 1,
                  }
                  : { opacity: 0 }
              }
              transition={{ duration: 1.5, delay: i * 0.1, ease: "easeInOut" }}
            />
          ))}


          {/* Right Channel Influx - Explicit path through channel */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.circle
              key={`ca-right-${i}`}
              r={4}
              fill={COLORS.calcium}
              initial={{ cx: 460, cy: 190 + i * 5, opacity: 0 }}
              animate={
                step >= 2
                  ? {
                    cx: [460, 425, 380], // Path: Outside -> Through Channel -> Inside Bulb
                    cy: [190 + i * 5, 210, 240 + i * 8],
                    opacity: 1,
                  }
                  : { opacity: 0 }
              }
              transition={{ duration: 1.5, delay: i * 0.1, ease: "easeInOut" }}
            />
          ))}


          {/* --- VESICLE FUSION & EXOCYTOSIS ANIMATION --- */}


          {/* This group handles the Main Vesicle that will fuse.
             Step 0-1: Static
             Step 2: Moves down (Approach)
             Step 3: Morphs into Omega shape (Fusion)
          */}


          {/* 1. APPROACHING VESICLE (Circle Primitive) 
              Visible during Steps 0, 1, and 2. 
              Hides in Step 3 when the Morph Path takes over.
          */}
          <motion.g
            initial={{ y: 0 }}
            animate={step === 2 ? { y: 60 } : { y: 0 }}
            transition={{ duration: 1, delay: step === 2 ? 1.5 : 0 }} // Wait for Ca2+ before moving
            style={{ display: step >= 3 ? "none" : "block" }}
          >
            <circle cx="300" cy="200" r="20" fill={COLORS.vesicle} />
            {/* ACh inside */}
            <circle cx="295" cy="195" r="3" fill={COLORS.ach} />
            <circle cx="305" cy="205" r="3" fill={COLORS.ach} />
            <circle cx="300" cy="200" r="3" fill={COLORS.ach} />
            <circle cx="300" cy="210" r="3" fill={COLORS.ach} />
          </motion.g>


          {/* 2. FUSING VESICLE (Morphing Path) 
              Visible starting Step 3.
              Starts shaped like the circle at the bottom (y=260).
              Morphs into the open Omega shape.
          */}
          {step >= 3 && (
            <g>
              {/* MEMBRANE GAP MASK: Hides the main neuron line where fusion happens */}
              <motion.rect
                x="270"
                y="275"
                height="10"
                fill={COLORS.motorNeuronFill} // Matches background to "erase" the line
                initial={{ width: 0 }} // Start with no gap
                animate={{ width: 60 }} // Expand to create gap (270 to 330)
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />


              {/* THE OMEGA SHAPE: Morphs from Closed Circle -> Open Pore */}
              <motion.path
                fill={COLORS.vesicle}
                stroke={COLORS.motorNeuron}
                strokeWidth="3"
                // Path 1: A closed circle shape resting on the membrane (simulating the vesicle at end of Step 2)
                // Path 2: The Omega shape opening up
                initial={{
                  d: "M 280,280 C 280,250 320,250 320,280 C 320,295 280,295 280,280 Z",
                }}
                animate={{
                  d: "M 270,280 C 275,280 280,240 300,240 C 320,240 325,280 330,280",
                }}
                transition={{ duration: 0.8, ease: "circOut" }}
              />
            </g>
          )}


          {/* Released ACh (Flowing out from the new pore) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={step >= 3 ? { opacity: 1 } : { opacity: 0 }}
          >
            {/* Particle 1 */}
            <motion.circle
              r="4"
              fill={COLORS.ach}
              initial={{ cx: 300, cy: 250 }} // Start inside the fusion pore
              animate={step >= 4 ? { cy: 300, cx: 280 } : { cy: 280, cx: 300 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }} // Delay slightly to let pore open
            />
            {/* Particle 2 */}
            <motion.circle
              r="4"
              fill={COLORS.ach}
              initial={{ cx: 310, cy: 245 }}
              animate={step >= 4 ? { cy: 300, cx: 320 } : { cy: 285, cx: 315 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
            />
            {/* Particle 3 */}
            <motion.circle
              r="4"
              fill={COLORS.ach}
              initial={{ cx: 290, cy: 245 }}
              animate={step >= 4 ? { cy: 300, cx: 240 } : { cy: 285, cx: 285 }}
              transition={{ duration: 1.1, ease: "easeOut", delay: 0.7 }}
            />
            {/* Particle 4 (New) */}
            <motion.circle
              r="4"
              fill={COLORS.ach}
              initial={{ cx: 300, cy: 240 }}
              animate={step >= 4 ? { cy: 310, cx: 300 } : { cy: 290, cx: 300 }}
              transition={{ duration: 1.3, ease: "easeOut", delay: 0.8 }}
            />
          </motion.g>


          {/* Motor End Plate */}
          <motion.path
            d="M 0,310 L 220,310 L 240,340 L 260,310 L 280,340 L 300,310 L 320,340 L 340,310 L 360,340 L 380,310 L 600,310"
            fill="none"
            stroke={COLORS.sarcolemma}
            strokeWidth="4"
            animate={
              step >= 5
                ? { stroke: "#f43f5e", strokeWidth: 6 }
                : { stroke: COLORS.sarcolemma }
            }
          />


          {/* Receptors */}
          <rect x="235" y="300" width="10" height="15" fill="#475569" />
          <rect x="275" y="300" width="10" height="15" fill="#475569" />
          <rect x="315" y="300" width="10" height="15" fill="#475569" />
          <rect x="355" y="300" width="10" height="15" fill="#475569" />


          {/* Na+ Influx */}
          <Particles
            count={8}
            color={COLORS.sodium}
            cx={300}
            cy={260}
            active={step >= 5}
            targetY={360}
            delay={0}
          />


          {/* Muscle Fiber Depolarization (Step 5+) */}
          {step >= 5 && (
            <motion.g>
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.text
                  key={`muscle-charge-${i}`}
                  x={40 + i * 50}
                  y={380}
                  fill="#fbbf24" // Yellow/Gold
                  fontSize="20"
                  fontWeight="bold"
                  textAnchor="middle"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 + 0.5, duration: 0.3 }}
                >
                  +
                </motion.text>
              ))}
              <motion.text
                x="200"
                y="360"
                fill="#be185d"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Muscle Fiber Depolarizes (+)
              </motion.text>
            </motion.g>
          )}


          {/* --- TRIAD STRUCTURE (T-TUBULE & SR) --- */}
          <g transform="translate(0, 0)">
            {/* 1. SARCOLEMMA + T-TUBULE (U-SHAPE) */}
            {/* Replaces the simple line. Creates the deep invagination. */}
            <path
              d="M 400,310 L 460,310 L 460,380 Q 480,400 500,380 L 500,310 L 600,310"
              fill="none"
              stroke={COLORS.sarcolemma}
              strokeWidth="4"
              strokeLinejoin="round"
            />


            {/* Action Potential traveling down T-Tubule (Step 6) */}
            {step >= 6 && (
              <motion.path
                d="M 460,310 L 460,380 Q 480,400 500,380 L 500,310"
                fill="none"
                stroke="#fbbf24" // Electric Yellow
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "linear" }}
              />
            )}


            {/* 2. LEFT SARCOPLASMIC RETICULUM (Junctional + Longitudinal) */}
            <path
              d="M 380,320 H 430 Q 445,320 445,335 V 365 Q 445,380 430,380 H 380"
              fill={COLORS.sr}
              fillOpacity="0.3"
              stroke={COLORS.sr}
              strokeWidth="2"
            />
            {/* Left Calcium Release Channels (RyR) facing T-tubule */}
            <rect x="445" y="340" width="6" height="10" fill="#f97316" rx="1" />
            <rect x="445" y="360" width="6" height="10" fill="#f97316" rx="1" />


            {/* 3. RIGHT SARCOPLASMIC RETICULUM (Junctional + Longitudinal) */}
            <path
              d="M 580,320 H 530 Q 515,320 515,335 V 365 Q 515,380 530,380 H 580"
              fill={COLORS.sr}
              fillOpacity="0.3"
              stroke={COLORS.sr}
              strokeWidth="2"
            />
            {/* Right Calcium Release Channels (RyR) facing T-tubule */}
            <rect x="509" y="340" width="6" height="10" fill="#f97316" rx="1" />
            <rect x="509" y="360" width="6" height="10" fill="#f97316" rx="1" />


            {/* 4. LABELS */}
            <text
              x="480"
              y="350"
              textAnchor="middle"
              fill="#be185d"
              className="text-[10px] font-bold"
            >
              T-Tubule
            </text>
            <text
              x="415"
              y="350"
              textAnchor="middle"
              fill={COLORS.sr}
              className="text-[10px] font-bold"
            >
              SR
            </text>
            <text
              x="550"
              y="350"
              textAnchor="middle"
              fill={COLORS.sr}
              className="text-[10px] font-bold"
            >
              SR
            </text>


            {/* 5. CALCIUM RELEASE ANIMATION (Step 7) */}
            {/* Left Side Release */}
            <Particles
              count={6}
              color={COLORS.calcium}
              cx={440}
              cy={350}
              active={step >= 7}
              targetY={390}
              delay={0}
            />
            {/* Right Side Release */}
            <Particles
              count={6}
              color={COLORS.calcium}
              cx={520}
              cy={350}
              active={step >= 7}
              targetY={390}
              delay={0.1}
            />
          </g>
        </svg>


        {/* Action Indicators */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-full text-xs font-mono shadow">
          Step {step}/7
        </div>
      </div>


      <div className="flex justify-between items-center mt-4">
        <InfoBox
          title={LEVEL_2_STEPS[step].title}
          text={LEVEL_2_STEPS[step].text}
        />
        <div className="flex gap-2 ml-4">
          <Button onClick={reset} className="bg-gray-500 hover:bg-gray-600">
            <RotateCcw size={18} />
          </Button>
          {/* FIX: Changed disabled logic so button is active at Step 7 to trigger Quiz */}
          <Button onClick={nextStep} disabled={step > 7}>
            {step === 7 ? "Quiz Time!" : "Trigger Next"}{" "}
            <ChevronRight size={18} className="inline ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};


// LEVEL 3: Sarcomere Structure
const Level3 = ({ onComplete }) => {
  const [hovered, setHovered] = useState(null);


  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 flex items-center justify-center p-8">
        <svg viewBox="0 0 800 350" className="w-full h-full">
          {/* --- Z-DISKS (Thick Black Lines) --- */}
          {/* Left */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="300"
            stroke="#000000"
            strokeWidth="8"
            strokeLinecap="square"
          />
          <text
            x="50"
            y="40"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#000000"
            className="dark:fill-white"
          >
            Z Line
          </text>


          {/* Right */}
          <line
            x1="750"
            y1="50"
            x2="750"
            y2="300"
            stroke="#000000"
            strokeWidth="8"
            strokeLinecap="square"
          />
          <text
            x="750"
            y="40"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#000000"
            className="dark:fill-white"
          >
            Z Line
          </text>


          {/* --- M-LINE (Dashed Center) --- */}
          <line
            x1="400"
            y1="60"
            x2="400"
            y2="290"
            stroke="#475569"
            strokeWidth="2"
            strokeDasharray="6,4"
          />
          <text
            x="400"
            y="40"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#475569"
            className="dark:fill-slate-400"
          >
            M-line
          </text>


          {/* --- ACTIN (Thin Filaments) --- */}
          {/* 4 Rows: Top, Upper-Mid, Lower-Mid, Bottom */}
          {[80, 130, 180, 230].map((y, i) => (
            <g key={`actin-${i}`}>
              {/* Left Strand (Attached to Z-disk) */}
              <line
                x1="54"
                y1={y}
                x2="350"
                y2={y}
                stroke="#a8a29e"
                strokeWidth="4"
              />
              {/* Right Strand (Attached to Z-disk) */}
              <line
                x1="450"
                y1={y}
                x2="746"
                y2={y}
                stroke="#a8a29e"
                strokeWidth="4"
              />
            </g>
          ))}


          {/* --- MYOSIN (Thick Filaments) --- */}
          {/* 3 Rows interleaving the Actin */}
          {[105, 155, 205].map((y, i) => (
            <g key={`myosin-${i}`}>
              {/* Main Orange Bar */}
              <rect
                x="250"
                y={y - 7}
                width="300"
                height="14"
                fill="#f97316"
                rx="1"
              />


              {/* Myosin Heads (Projecting Up towards Actin) */}
              {Array.from({ length: 10 }).map((_, j) => (
                <g
                  key={`head-up-${j}`}
                  transform={`translate(${270 + j * 28}, ${y - 7})`}
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="5"
                    y2="-12"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="5" cy="-12" r="3" fill="#dc2626" />
                </g>
              ))}


              {/* Myosin Heads (Projecting Down towards Actin) */}
              {Array.from({ length: 10 }).map((_, j) => (
                <g
                  key={`head-down-${j}`}
                  transform={`translate(${270 + j * 28}, ${y + 7})`}
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="5"
                    y2="12"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="5" cy="12" r="3" fill="#dc2626" />
                </g>
              ))}
            </g>
          ))}


          {/* --- STATIC LABELS MATCHING IMAGE --- */}
          {/* Actin Label */}
          <line
            x1="600"
            y1="70"
            x2="650"
            y2="80"
            stroke="#000000"
            strokeWidth="1"
            className="dark:stroke-white"
          />
          <text
            x="600"
            y="65"
            textAnchor="end"
            fontSize="14"
            fontWeight="bold"
            fill="#000000"
            className="dark:fill-white"
          >
            Actin
          </text>


          {/* Myosin Label */}
          <line
            x1="280"
            y1="90"
            x2="320"
            y2="100"
            stroke="#000000"
            strokeWidth="1"
            className="dark:stroke-white"
          />
          <text
            x="280"
            y="85"
            textAnchor="end"
            fontSize="14"
            fontWeight="bold"
            fill="#000000"
            className="dark:fill-white"
          >
            Myosin
          </text>


          {/* Myosin Heads Label */}
          <line
            x1="280"
            y1="230"
            x2="300"
            y2="215"
            stroke="#000000"
            strokeWidth="1"
            className="dark:stroke-white"
          />
          <text
            x="280"
            y="245"
            textAnchor="end"
            fontSize="14"
            fontWeight="bold"
            fill="#000000"
            className="dark:fill-white"
          >
            Myosin heads
          </text>


          {/* H-Zone Indicator */}
          <line
            x1="350"
            y1="280"
            x2="450"
            y2="280"
            stroke="#000000"
            strokeWidth="1"
            markerEnd="url(#arrow)"
            markerStart="url(#arrow)"
            className="dark:stroke-white"
          />
          <text
            x="400"
            y="300"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#000000"
            className="dark:fill-white"
          >
            H-zone
          </text>


          {/* A-Band Indicator */}
          <line
            x1="255"
            y1="315"
            x2="545"
            y2="315"
            stroke="#000000"
            strokeWidth="1"
            className="dark:stroke-white"
          />
          <text
            x="400"
            y="335"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#000000"
            className="dark:fill-white"
          >
            A-band
          </text>


          {/* I-Band Indicators (Added) */}
          <line
            x1="50"
            y1="315"
            x2="245"
            y2="315"
            stroke="#000000"
            strokeWidth="1"
            className="dark:stroke-white"
          />
          <text
            x="150"
            y="335"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#000000"
            className="dark:fill-white"
          >
            I-band
          </text>


          <line
            x1="555"
            y1="315"
            x2="750"
            y2="315"
            stroke="#000000"
            strokeWidth="1"
            className="dark:stroke-white"
          />
          <text
            x="650"
            y="335"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#000000"
            className="dark:fill-white"
          >
            I-band
          </text>


          {/* --- INTERACTIVE ZONES (Invisible Hitboxes) --- */}


          {/* Z Line Zone (Left & Right) */}
          <rect
            x="20"
            y="40"
            width="60"
            height="270"
            fill="transparent"
            onMouseEnter={() => setHovered("z-line")}
            className="cursor-help hover:fill-blue-500/20"
          />
          <rect
            x="720"
            y="40"
            width="60"
            height="270"
            fill="transparent"
            onMouseEnter={() => setHovered("z-line")}
            className="cursor-help hover:fill-blue-500/20"
          />


          {/* M Line Zone */}
          <rect
            x="380"
            y="60"
            width="40"
            height="230"
            fill="transparent"
            onMouseEnter={() => setHovered("m-line")}
            className="cursor-help hover:fill-purple-500/20"
          />


          {/* H Zone (Center, no Actin) */}
          <rect
            x="350"
            y="80"
            width="100"
            height="150"
            fill="transparent"
            onMouseEnter={() => setHovered("h-zone")}
            className="cursor-help hover:fill-yellow-500/20"
          />


          {/* I Band (Actin Only - Left & Right edges) */}
          <rect
            x="60"
            y="60"
            width="190"
            height="200"
            fill="transparent"
            onMouseEnter={() => setHovered("i-band")}
            className="cursor-help hover:fill-green-500/10"
          />
          <rect
            x="550"
            y="60"
            width="190"
            height="200"
            fill="transparent"
            onMouseEnter={() => setHovered("i-band")}
            className="cursor-help hover:fill-green-500/10"
          />


          {/* A Band (Entire Myosin length) */}
          <rect
            x="250"
            y="90"
            width="300"
            height="130"
            fill="transparent"
            onMouseEnter={() => setHovered("a-band")}
            className="cursor-help hover:fill-red-500/10"
          />
        </svg>
      </div>


      <div className="flex justify-between items-start mt-4">
        <InfoBox
          title={
            hovered
              ? SARCOMERE_ZONES.find((z) => z.id === hovered).label
              : "Sarcomere Anatomy"
          }
          text={
            hovered
              ? SARCOMERE_ZONES.find((z) => z.id === hovered).text
              : "Hover over the Z-line, M-line, H-zone, I-band, or A-band to identify them."
          }
        />
        <Button onClick={onComplete} className="ml-4 mt-8">
          Unlock SFT
        </Button>
      </div>
    </div>
  );
};


// LEVEL 4: Sliding Filament Theory
const Level4 = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 1-based steps in prompt, using 0 for start
  const [isLooping, setIsLooping] = useState(false);
  const [relaxing, setRelaxing] = useState(false);
  const [showATP, setShowATP] = useState(false);


  // Quiz States - Expanded to cover all requested quiz steps
  const [quizState, setQuizState] = useState({
    1: false, // Tropomyosin
    3: false, // Calcium
    4: false, // Myosin Binding Sites
    8: false, // Cross-bridge
    10: false, // Power stroke
    11: false, // H zone and I band
  });
  const [quizShake, setQuizShake] = useState(0);


  useEffect(() => {
    let interval;
    if (isLooping && !relaxing) {
      interval = setInterval(() => {
        setStep((prev) => {
          const next = (prev % 15) + 1; // Loop 1-15
          // Auto-solve quizzes if looping
          setQuizState((prevQ) => ({ ...prevQ, [next]: true }));
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLooping, relaxing]);


  const handleNext = () => {
    if ([1, 3, 4, 8, 10, 11].includes(step) && !quizState[step]) {
      setQuizShake((s) => s + 1);
      return;
    }
    if (step < 15) setStep(step + 1);
    else setStep(1);
  };


  const handleRelax = () => {
    setRelaxing(true);
    setIsLooping(false);
    setStep(13); // Jump to relaxation phase
    setTimeout(() => {
      setRelaxing(false);
      setStep(15);
    }, 3000);
  };


  const handleQuizOption = (option, currentStep) => {
    let correct = false;
    switch (currentStep) {
      case 1:
        if (option === "Tropomyosin") correct = true;
        break;
      case 3:
        if (option === "Ca²⁺") correct = true;
        break;
      case 4:
        if (option === "Myosin Binding Sites") correct = true;
        break;
      case 8:
        if (option === "Cross-bridge") correct = true;
        break;
      case 10:
        if (option === "Power") correct = true;
        break;
      case 11:
        if (option === "H zone & I band") correct = true;
        break;
      default:
        break;
    }


    if (correct) {
      setQuizState((prev) => ({ ...prev, [currentStep]: true }));
    } else {
      setQuizShake((s) => s + 1);
    }
  };


  // Animation logic mapped to 15 steps
  const headRotation = () => {
    // Left (-45) = Low Energy / Relaxed (Before ATP Hydrolysis / End of Stroke)
    // Right (15) = High Energy / Cocked (After Hydrolysis) - Reduced angle to keep it close


    // Step 7 (High Energy) -> Step 9 (Release): Bent Right (Cocked)
    if (step >= 7 && step <= 9) return 15;


    // Step 10 (Power Stroke) -> Step 12 (Detach Start): Transitions from Right(15) to Left(-45)
    if (step >= 10 && step <= 12) return -45;


    // All other steps (Resting, ATP Binding, Hydrolysis, Relaxation): Bent Left (Low Energy)
    return -45;
  };


  const actinX = () => {
    if (step >= 15 || step <= 1) return 0; // Relaxing/Reset
    if (step >= 13) return 0; // Start sliding back


    // Pulled inward at Power Stroke.
    // Adjusted to -57 to perfectly match the head's horizontal swing from +15deg to -45deg
    if (step >= 10) return -57;
    return 0;
  };


  const headY = () => {
    // UPDATED: Kept constant to prevent "lifting".
    // Pivot Base Y=185 (150 + 35). Thick Filament Top is 180.
    // This keeps the anchor buried inside the thick filament.
    return 150;
  };


  // Constants for Actin/Tropomyosin generation
  const ACTIN_Y_OFFSET = 135; // UPDATED: Lowered Actin (was 125) to meet the head
  const ACTIN_RADIUS = 6;
  const ACTIN_X_SPACING = 12;
  const ACTIN_START_X = 85;


  // Helper to generate helical actin beads
  const renderActinHelix = () => {
    const beads = [];
    for (let i = 0; i < 38; i++) {
      // Render up to ~450 width
      const x = i * ACTIN_X_SPACING;


      // H-ZONE LOGIC: Skip beads in the first 50px to create the H-Zone gap
      if (x < ACTIN_START_X) continue;


      const y1 = Math.sin(i * 0.5) * ACTIN_RADIUS;
      const y2 = Math.sin(i * 0.5 + Math.PI) * ACTIN_RADIUS;
      beads.push({
        x,
        y: ACTIN_Y_OFFSET + y1,
        color: COLORS.actin,
        key: `s1-${i}`,
      });
      beads.push({
        x,
        y: ACTIN_Y_OFFSET + y2,
        color: "#fca5a5",
        key: `s2-${i}`,
        hasBindingSite: i % 5 === 2,
      });
    }
    return beads;
  };
  const actinBeads = renderActinHelix();


  // Helper to generate tropomyosin path data
  const renderTropomyosinPath = () => {
    // Blocking: Step 1, 2, 15 (Resting/Relaxed)
    // Exposed: Step 4-14
    const isBlocking = step <= 3 || step === 15 || step === 0;
    const offset = isBlocking ? 0 : 5; // Pixel shift to expose sites


    const getStrand2Y = (i) =>
      ACTIN_Y_OFFSET + ACTIN_RADIUS * Math.sin(i * 0.5 + Math.PI);


    // Start path at the first visible bead (around index 4 or 5)
    let startI = Math.ceil(ACTIN_START_X / ACTIN_X_SPACING);
    let d = `M ${startI * ACTIN_X_SPACING},${getStrand2Y(startI) + offset}`;


    for (let i = startI + 1; i < 38; i++) {
      const x = i * ACTIN_X_SPACING;
      const y = getStrand2Y(i) + offset;
      d += ` L ${x},${y}`;
    }
    return d;
  };


  const tropomyosinD = renderTropomyosinPath();


  // --- RENDER QUIZ UI HELPER ---
  const renderQuiz = (currentStep) => {
    const commonClasses =
      "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-4 rounded-xl border-l-4 border-amber-500 shadow-lg mt-4 min-h-[100px] flex-grow";
    const shakeStyle = {
      x: quizShake % 2 === 0 ? 0 : [0, -10, 10, -10, 10, 0],
    };
    const transition = { duration: 0.4 };
    const qSpan = (
      <span className="px-2 py-0.5 border-b-2 border-amber-400 font-bold text-slate-500 bg-amber-50 dark:bg-slate-700 rounded mx-1">
        ?
      </span>
    );


    let question = "";
    let options = [];


    switch (currentStep) {
      case 1:
        question = <>At rest, {qSpan} blocks the myosin binding sites.</>;
        options = ["Troponin", "Myosin", "Tropomyosin", "Actin"];
        break;
      case 3:
        question = <>{qSpan} bind to the troponin complex.</>;
        options = ["Na⁺", "K⁺", "Ca²⁺", "ATP"];
        break;
      case 4:
        question = (
          <>Troponin changes conformation, exposing the {qSpan} on actin.</>
        );
        options = ["Z-Lines", "M-Line", "Myosin Binding Sites", "ATP"];
        break;
      case 8:
        question = <>Myosin head binds to actin forming {qSpan}.</>;
        options = [
          "Cross-bridge",
          "Power Stroke",
          "Active Transport",
          "Hydrolysis",
        ];
        break;
      case 10:
        question = <>Myosin head bends, creating a {qSpan} stroke.</>;
        options = ["Recovery", "Power", "Heat", "Relaxation"];
        break;
      case 11:
        question = (
          <>
            Muscle contract. Shorten the {qSpan} zone and {qSpan} band.
          </>
        );
        options = ["H zone & I band", "A band & Z line", "M line & A band"];
        break;
      default:
        return null;
    }


    return (
      <motion.div
        animate={shakeStyle}
        transition={transition}
        className={commonClasses}
      >
        <h3 className="font-bold text-amber-600 dark:text-amber-400 text-lg mb-2 flex items-center">
          <Activity size={18} className="mr-2" /> Knowledge Check
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-3 text-sm leading-relaxed">
          {question}
        </p>
        <div className="flex gap-2 flex-wrap">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleQuizOption(opt, currentStep)}
              className="px-3 py-1 bg-slate-100 hover:bg-amber-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition border border-slate-300 dark:border-slate-600"
            >
              {opt}
            </button>
          ))}
        </div>
      </motion.div>
    );
  };


  // Helper for background "Ghost" Rows to create the zoomed-out stack effect
  const BackgroundRow = ({ y, opacity }) => (
    <g opacity={opacity}>
      {/* Thick Filament (Myosin) - Static relative to M-line */}
      <rect
        x="0"
        y={y + 25}
        width="280"
        height="10"
        fill={COLORS.myosin}
        rx="2"
        opacity="0.6"
      />


      {/* Myosin Heads (Static hints) */}
      {[40, 80, 120, 160, 200, 240].map((tx) => (
        <path
          key={tx}
          d={`M ${tx},${y + 30} L ${tx - 5},${y + 10}`}
          stroke={COLORS.myosin}
          strokeWidth="3"
          fill="none"
          opacity="0.6"
        />
      ))}


      {/* Thin Filament (Actin) - Moves with the main actin group */}
      {/* We render this inside the main motion group below to sync movement, 
           or duplicate the motion group here. Duplicating for simplicity of layering. */}
      <motion.g animate={{ x: actinX() }} transition={{ duration: 0.8 }}>
        <line
          x1={ACTIN_START_X}
          y1={y}
          x2={444}
          y2={y}
          stroke={COLORS.actin}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Periodic beads pattern */}
        <line
          x1={ACTIN_START_X}
          y1={y}
          x2={444}
          y2={y}
          stroke="white"
          strokeWidth="2"
          strokeDasharray="4,4"
          opacity="0.5"
        />
      </motion.g>
    </g>
  );


  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
        {/* ATP Popup */}
        <AnimatePresence>
          {showATP && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute z-10 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl border border-yellow-400 max-w-sm"
            >
              <h3 className="text-xl font-bold text-yellow-600 mb-4 flex items-center">
                <Zap className="mr-2" /> Roles of ATP
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-yellow-500" />{" "}
                  Energizing power stroke
                </li>
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-yellow-500" />{" "}
                  Breaking cross bridge
                </li>
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-yellow-500" /> Pumping
                  Ca²⁺ into SR
                </li>
              </ul>
              <Button
                onClick={() => setShowATP(false)}
                className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600"
              >
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>


        <svg viewBox="0 0 400 300" className="w-full h-full">
          {/* --- SARCOPLASMIC RETICULUM (Added at Top) --- */}
          {/* UPDATED: Resize and reposition to avoid overlap with zone labels */}
          <g transform="translate(140, 5)">
            {/* Structure */}
            <defs>
              <pattern
                id="srGrid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect
              x="0"
              y="0"
              width="120"
              height="25"
              rx="8"
              fill={COLORS.sr}
              fillOpacity="0.9"
              stroke={COLORS.sr}
              strokeWidth="2"
            />
            <rect
              x="0"
              y="0"
              width="120"
              height="25"
              rx="8"
              fill="url(#srGrid)"
            />
            <text
              x="60"
              y="16"
              textAnchor="middle"
              fill="white"
              fontSize="9"
              fontWeight="bold"
            >
              Sarcoplasmic Reticulum
            </text>


            {/* Ca2+ inside SR (Visual only) */}
            <circle cx="20" cy="12" r="2" fill="white" opacity="0.5" />
            <circle cx="100" cy="12" r="2" fill="white" opacity="0.5" />
            <circle cx="40" cy="8" r="2" fill="white" opacity="0.5" />
            <circle cx="80" cy="15" r="2" fill="white" opacity="0.5" />
          </g>


          {/* --- CALCIUM TRANSIT ANIMATION --- */}
          {/* Step 2: Release (Downwards) */}
          {step === 2 && (
            <g>
              {[150, 250, 350].map((targetX, i) => (
                <motion.circle
                  key={`ca-release-${i}`}
                  r={4}
                  fill={COLORS.calcium}
                  initial={{ cx: 160 + i * 20, cy: 30, opacity: 1 }} // Start from center of new SR position
                  animate={{ cx: targetX, cy: 120, opacity: 0 }} // Move to Troponin and fade (handoff to static binding)
                  transition={{ duration: 1, delay: i * 0.2, ease: "easeIn" }}
                />
              ))}
              {/* Extra particles for visual effect */}
              <motion.circle
                r={3}
                fill={COLORS.calcium}
                initial={{ cx: 180, cy: 30 }}
                animate={{ cy: 200, opacity: 0 }}
                transition={{ duration: 1.5 }}
              />
              <motion.circle
                r={3}
                fill={COLORS.calcium}
                initial={{ cx: 220, cy: 30 }}
                animate={{ cy: 200, opacity: 0 }}
                transition={{ duration: 1.2 }}
              />
            </g>
          )}


          {/* Step 13: Uptake (Upwards) */}
          {step === 13 && (
            <g>
              {[150, 250, 350].map((startX, i) => (
                <motion.circle
                  key={`ca-uptake-${i}`}
                  r={4}
                  fill={COLORS.calcium}
                  initial={{ cx: startX, cy: 120, opacity: 1 }} // Start at Troponin
                  animate={{ cx: 200, cy: 30, opacity: 0 }} // Move back to SR
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </g>
          )}


          {/* --- HIGHLIGHTED ZONES (Background - Full Height) --- */}


          {/* H-ZONE HIGHLIGHT (Yellow) */}
          {/* Starts at M-line (5), width shrinks as actinX becomes negative */}
          <motion.rect
            x="5"
            y="20"
            height="260"
            fill="#fbbf24"
            opacity="0.1"
            initial={{ width: 85 }} // UPDATED: Match new ACTIN_START_X
            animate={{ width: Math.max(15, 85 + actinX()) }} // UPDATED animation logic
            transition={{ duration: 0.8 }}
          />


          {/* I-BAND HIGHLIGHT (Green) */}
          <motion.rect
            x="280"
            y="20"
            height="260"
            fill="#22c55e"
            opacity="0.1"
            initial={{ width: 164 }}
            animate={{ width: Math.max(0, 164 + actinX()) }}
            transition={{ duration: 0.8 }}
          />


          {/* --- GHOST ROWS (Top & Bottom) --- */}
          <BackgroundRow y={40} opacity={0.3} />
          <BackgroundRow y={230} opacity={0.3} />


          {/* --- STATIC BACKGROUND MARKERS --- */}


          {/* M-LINE (Center of Sarcomere - Full Height) */}
          <line
            x1="5"
            y1="20"
            x2="5"
            y2="280"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeDasharray="6,4"
          />
          <text
            x="5"
            y="295"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="10"
            fontWeight="bold"
          >
            M-LINE
          </text>


          {/* H-ZONE LABEL (Top) */}
          <motion.g animate={{ opacity: step >= 10 ? 0.6 : 1 }}>
            {/* UPDATED: Extended line to 85, centered text at 45 */}
            <line
              x1="5"
              y1="25"
              x2="85"
              y2="25"
              stroke="#fbbf24"
              strokeWidth="1"
              markerEnd="url(#arrow)"
              markerStart="url(#arrow)"
            />
            <text
              x="45"
              y="20"
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="9"
              fontWeight="bold"
            >
              H-ZONE
            </text>
          </motion.g>


          {/* I-BAND LABEL (Top) */}
          <motion.g animate={{ x: actinX() }}>
            <line
              x1="280"
              y1="25"
              x2="444"
              y2="25"
              stroke="#22c55e"
              strokeWidth="1"
            />
            <text
              x="362"
              y="20"
              textAnchor="middle"
              fill="#22c55e"
              fontSize="9"
              fontWeight="bold"
            >
              I-BAND
            </text>
          </motion.g>


          {/* --- ACTIN FILAMENT GROUP (Moves Left/Right) --- */}
          <motion.g animate={{ x: actinX() }} transition={{ duration: 0.8 }}>
            {/* Z-LINE (Full Height - Attached to Actin) */}
            {/* Draws a jagged or straight line across the full view */}
            <line
              x1="444"
              y1="20"
              x2="444"
              y2="280"
              stroke="#0f172a"
              strokeWidth="6"
              strokeLinecap="square"
            />
            <text
              x="444"
              y="15"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="10"
              fontWeight="bold"
            >
              Z-LINE
            </text>


            {/* Actin Beads (The Helix) with Binding Sites */}
            {actinBeads.map((bead) => (
              <g key={bead.key}>
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r="6"
                  fill={bead.color}
                  stroke="white"
                  strokeWidth="0.5"
                />
                {bead.hasBindingSite && (
                  <circle cx={bead.x} cy={bead.y} r="2.5" fill="#374151" />
                )}
              </g>
            ))}


            {/* Tropomyosin (Animated Path) */}
            <motion.path
              d={tropomyosinD}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="4"
              strokeOpacity="0.8"
              style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
              animate={{ d: tropomyosinD }} // Smooth morph
              transition={{ duration: 0.5 }}
            />


            {/* Troponin Complex (Blue) */}
            {[150, 250, 350].map((x, i) => (
              <g key={`troponin-${i}`} transform={`translate(${x}, 129)`}>
                {" "}
                {/* UPDATED: Lowered Y to 129 to sit on Actin */}
                <circle cx="0" cy="0" r="4" fill="#60a5fa" /> {/* TnC */}
                <circle cx="5" cy="4" r="3.5" fill="#3b82f6" /> {/* TnI */}
                <circle cx="-4" cy="4" r="3.5" fill="#2563eb" /> {/* TnT */}
                {/* Ca2+ Binding Visual for Step 3-13 */}
                {step >= 3 && step <= 13 && (
                  <motion.circle
                    cx="0"
                    cy="-5"
                    r="3"
                    fill={COLORS.calcium}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </g>
            ))}


            {/* Active Binding Site Highlight (Cross-bridge Step) */}
            <circle
              cx="115"
              cy="130"
              r="4"
              fill="yellow"
              opacity={step >= 8 && step <= 11 ? 0.3 : 0}
            />
          </motion.g>


          {/* --- MAIN MYOSIN FILAMENT --- */}
          <g transform="translate(0, 10)">
            <defs>
              <linearGradient id="myosinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>


            {/* Myosin Body */}
            <rect
              x="0"
              y="180"
              width="280"
              height="25"
              fill="url(#myosinGrad)"
              rx="5"
            />
            <line
              x1="0"
              y1="192"
              x2="280"
              y2="192"
              stroke="#b91c1c"
              strokeWidth="2"
              strokeDasharray="10,5"
            />


            {/* Myosin Head Assembly (Group Rotation) */}
            <motion.g
              initial={{ x: 100, y: 160 }}
              animate={{
                x: 100,
                // ANIMATION LOGIC:
                // Constant Y=150 ensures base stays anchored in thick filament (y=180+)
                y: step === 12 ? [150, 150, 160] : 150, // Slight drop on detach (Step 12)
                rotate: headRotation(),
              }}
              style={{ originX: 0.5, originY: 1 }} // Pivot from base
              transition={{
                duration: 0.5,
                // Step 12: Hold for 0.3s (wait for ATP), then drop
                y:
                  step === 12
                    ? { times: [0, 0.2, 1], duration: 1.5, ease: "easeInOut" }
                    : { duration: 0.5 },
              }}
            >
              {/* Arm/Neck (Hinge) - ELONGATED */}
              <motion.path
                d="M 0,35 L 0,-25"
                stroke={COLORS.myosin}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />


              {/* The Head Itself (Pear shape) - Adjusted for longer neck */}
              <motion.path
                d="M -8,-25 Q -12,-35 0,-40 Q 12,-35 8,-25 Q 5,-15 0,-15 Q -5,-15 -8,-25 Z"
                fill={COLORS.myosin}
                stroke="#7f1d1d"
                strokeWidth="1"
              />


              {/* ATP/ADP Visualization - Inside rotating group to stick to head */}


              {/* Step 5: ATP Binding Animation */}
              {step === 5 && (
                <motion.circle
                  cx="0"
                  cy="-30"
                  r="6"
                  fill={COLORS.atp}
                  stroke="white"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}


              {/* Step 6: Hydrolysis (ATP -> ADP+Pi) */}
              {step === 6 && (
                <g>
                  {/* 1. ATP Molecule (Yellow) */}
                  <motion.circle
                    cx="0"
                    cy="-30"
                    r="6"
                    fill={COLORS.atp}
                    stroke="white"
                    strokeWidth="1"
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  />
                  {/* 2. Hydrolysis Products (ADP + Pi) */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <circle
                      cx="-8"
                      cy="-35"
                      r="4"
                      fill="#fb923c"
                      stroke="white"
                      strokeWidth="1"
                    />
                    <text
                      x="-14"
                      y="-32"
                      fontSize="9"
                      fill="#fb923c"
                      textAnchor="end"
                      fontWeight="bold"
                    >
                      ADP
                    </text>


                    <circle
                      cx="8"
                      cy="-35"
                      r="4"
                      fill="#fb923c"
                      stroke="white"
                      strokeWidth="1"
                    />
                    <text
                      x="14"
                      y="-32"
                      fontSize="9"
                      fill="#fb923c"
                      textAnchor="start"
                      fontWeight="bold"
                    >
                      Pi
                    </text>
                  </motion.g>
                </g>
              )}


              {/* Steps 7-8: Holding ADP+Pi */}
              {(step === 7 || step === 8) && (
                <g>
                  <circle
                    cx="-8"
                    cy="-35"
                    r="4"
                    fill="#fb923c"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <text
                    x="-14"
                    y="-32"
                    fontSize="9"
                    fill="#fb923c"
                    textAnchor="end"
                    fontWeight="bold"
                  >
                    ADP
                  </text>


                  <circle
                    cx="8"
                    cy="-35"
                    r="4"
                    fill="#fb923c"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <text
                    x="14"
                    y="-32"
                    fontSize="9"
                    fill="#fb923c"
                    textAnchor="start"
                    fontWeight="bold"
                  >
                    Pi
                  </text>
                </g>
              )}


              {/* Step 12: New ATP Binds */}
              {step === 12 && (
                <motion.circle
                  cx="0"
                  cy="-30"
                  r="6"
                  fill={COLORS.atp}
                  stroke="white"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.g>
          </g>


          {/* Labels - Realigned to match new Actin Height */}


          {/* Troponin: Moved Left (x=90) to create space */}
          <text
            x="90"
            y="70"
            textAnchor="middle"
            fill="#3b82f6"
            className="text-[10px] font-bold"
          >
            Troponin Complex
          </text>
          <line
            x1="90"
            y1="75"
            x2="150"
            y2="129"
            stroke="#3b82f6"
            strokeWidth="1"
          />


          {/* Binding Sites: Moved Left (x=190) */}
          <text
            x="190"
            y="70"
            textAnchor="middle"
            fill="#374151"
            className="text-[10px] font-bold"
          >
            Myosin Binding Sites
          </text>
          <line
            x1="190"
            y1="75"
            x2="204"
            y2="128"
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="2,2"
          />


          {/* Actin: Moved Next to Tropomyosin (x=280) */}
          <text
            x="280"
            y="70"
            textAnchor="middle"
            fill={COLORS.actin}
            className="text-[10px] font-bold"
          >
            Thin Filament (Actin)
          </text>
          <line
            x1="280"
            y1="75"
            x2="280"
            y2="128"
            stroke={COLORS.actin}
            strokeWidth="1"
          />


          {/* Tropomyosin: Moved Right (x=360) */}
          <text
            x="360"
            y="70"
            textAnchor="middle"
            fill="#60a5fa"
            className="text-[10px] font-bold"
          >
            Tropomyosin
          </text>
          <line
            x1="360"
            y1="75"
            x2="330"
            y2="132"
            stroke="#60a5fa"
            strokeWidth="1"
          />


          {/* Myosin: Bottom Right (Unchanged) */}
          <text
            x="280"
            y="240"
            textAnchor="end"
            fill={COLORS.myosin}
            className="text-xs font-bold"
          >
            Thick Filament (Myosin)
          </text>


          {/* Label: Calcium (Visible Step 3-13) */}
          {step >= 3 && step <= 13 && (
            <g>
              <line
                x1="250"
                y1="118"
                x2="260"
                y2="95"
                stroke={COLORS.calcium}
                strokeWidth="1"
              />
              <text
                x="265"
                y="95"
                textAnchor="start"
                fill={COLORS.calcium}
                className="text-[10px] font-bold"
              >
                Calcium (Ca²⁺)
              </text>
            </g>
          )}
        </svg>


        {/* ATP Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => setShowATP(true)}
            className="flex flex-col items-center p-2 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition"
          >
            <Zap className="text-yellow-600 mb-1" />
            <span className="text-[10px] font-bold text-yellow-700">
              ATP INFO
            </span>
          </button>
        </div>
      </div>


      <div className="flex justify-between items-center mt-4">
        {/* --- QUIZ & INFO AREA --- */}
        {[1, 3, 4, 8, 10, 11].includes(step) && !quizState[step] ? (
          renderQuiz(step)
        ) : (
          <InfoBox
            title={
              step > 0
                ? SFT_STEPS.find((s) => s.step === step).label
                : "Sliding Filament Theory"
            }
            text={
              step > 0
                ? SFT_STEPS.find((s) => s.step === step).text
                : "Click 'Next Step' to begin the cross-bridge cycle."
            }
          />
        )}


        <div className="flex flex-col gap-2 ml-4 min-w-[140px]">
          <Button
            onClick={handleNext}
            disabled={
              ([1, 3, 4, 8, 10, 11].includes(step) && !quizState[step]) ||
              relaxing ||
              isLooping
            }
          >
            {step === 0 ? "Start Cycle" : "Next Step"}
          </Button>
          <button
            onClick={() => setIsLooping(!isLooping)}
            disabled={
              relaxing ||
              ([1, 3, 4, 8, 10, 11].includes(step) && !quizState[step])
            }
            className={`text-xs font-bold py-1 px-2 rounded border ${isLooping
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-white text-gray-500 border-gray-300"
              }`}
          >
            {isLooping ? "Stop Auto" : "Auto Loop"}
          </button>
          <button
            onClick={handleRelax}
            className="text-xs font-bold py-1 px-2 rounded bg-pink-100 text-pink-700 hover:bg-pink-200"
          >
            Skip to End
          </button>
        </div>
      </div>
    </div>
  );
};


// LEVEL 5: Sarcomere Contraction Overview
const Level5 = ({ onComplete }) => {
  const [contraction, setContraction] = useState(0); // 0 to 100


  // Constants based on SVG viewbox 800 width
  const CENTER = 400;
  const MYOSIN_WIDTH = 300; // Total A-band width
  const ACTIN_WIDTH = 300; // Length of one actin filament
  const Z_START = 50;
  const Z_END = 750;


  // Dynamic Calculations based on contraction %
  // Max travel distance for actin to meet at M-line
  // Gap at 0% is roughly 100px. So travel 50px per side closes it.
  const maxTravel = 50;
  const currentTravel = (contraction / 100) * maxTravel;


  const zLeft = Z_START + currentTravel;
  const zRight = Z_END - currentTravel;


  // Actin Tips
  const actinLeftTip = zLeft + ACTIN_WIDTH;
  const actinRightTip = zRight - ACTIN_WIDTH;


  // Zone Widths
  const hZoneWidth = Math.max(0, actinRightTip - actinLeftTip);
  const iBandWidth = CENTER - MYOSIN_WIDTH / 2 - zLeft; // Space between Myosin Start and Z-line


  // Status Text
  const getStatus = () => {
    if (contraction === 0) return "Relaxed";
    if (contraction === 100) return "Fully Contracted (H-Zone Disappeared)";
    return "Contracting...";
  };


  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4">
        <h3 className="absolute top-4 left-4 font-bold text-slate-400 uppercase tracking-widest text-xs">
          Overview Mode
        </h3>


        <svg viewBox="0 0 800 350" className="w-full h-full">
          {/* --- EXCITATION SYSTEM (Sarcolemma, T-Tubules, SR) --- */}
          {/* Moved SR Group down to y=40 to make room for T-Tubules */}
          <g transform="translate(200, 40)">
            {/* 1. T-TUBULES & SARCOLEMMA (Above SR) */}
            {/* Sarcolemma Line (Top) */}
            <path
              d="M -150,-30 L 550,-30"
              stroke={COLORS.sarcolemma}
              strokeWidth="4"
              fill="none"
            />
            <text
              x="-140"
              y="-40"
              fill={COLORS.sarcolemma}
              fontSize="10"
              fontWeight="bold"
            >
              Sarcolemma
            </text>


            {/* T-Tubules (Dipping down on left and right of SR) */}
            {/* Left T-Tubule */}
            <path
              d="M -20,-30 L -20,15 Q -20,25 0,25"
              stroke={COLORS.sarcolemma}
              strokeWidth="4"
              fill="none"
            />
            <text
              x="-30"
              y="0"
              textAnchor="end"
              fill="#be185d"
              fontSize="10"
              fontWeight="bold"
            >
              T-Tubule
            </text>


            {/* Right T-Tubule */}
            <path
              d="M 420,-30 L 420,15 Q 420,25 400,25"
              stroke={COLORS.sarcolemma}
              strokeWidth="4"
              fill="none"
            />
            <text
              x="430"
              y="0"
              textAnchor="start"
              fill="#be185d"
              fontSize="10"
              fontWeight="bold"
            >
              T-Tubule
            </text>


            {/* ACTION POTENTIAL ANIMATION (Visible when contracting) */}
            {contraction > 0 && (
              <g>
                {/* Left AP Flow */}
                <motion.path
                  d="M -150,-30 L -20,-30 L -20,25"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                {/* Right AP Flow */}
                <motion.path
                  d="M 550,-30 L 420,-30 L 420,25"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                {/* Voltage Sensor Spark */}
                <motion.circle
                  cx="0"
                  cy="25"
                  r="4"
                  fill="#fbbf24"
                  animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
                <motion.circle
                  cx="400"
                  cy="25"
                  r="4"
                  fill="#fbbf24"
                  animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              </g>
            )}


            {/* 2. SARCOPLASMIC RETICULUM */}
            <defs>
              <pattern
                id="srGridLevel5"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            {/* SR Structure */}
            <rect
              x="0"
              y="0"
              width="400"
              height="30"
              rx="5"
              fill={COLORS.sr}
              fillOpacity="0.8"
              stroke={COLORS.sr}
              strokeWidth="1"
            />
            <rect
              x="0"
              y="0"
              width="400"
              height="30"
              rx="5"
              fill="url(#srGridLevel5)"
            />
            <text
              x="200"
              y="20"
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              Sarcoplasmic Reticulum (Ca²⁺)
            </text>


            {/* Calcium Ions (Visual Decoration inside SR) */}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle
                key={`sr-ca-${i}`}
                cx={20 + i * 50}
                cy={15}
                r={2}
                fill="white"
                opacity="0.6"
              />
            ))}


            {/* Calcium Release Animation (Visible when contracting) */}
            {contraction > 5 && (
              <g>
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.circle
                    key={`ca-drop-${i}`}
                    r={3}
                    fill={COLORS.calcium}
                    initial={{ cx: 20 + i * 25, cy: 30, opacity: 0 }}
                    animate={{
                      cy: [30, 100 + Math.random() * 150], // Fall down into the sarcomere
                      opacity: [1, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1 + Math.random(),
                      delay: Math.random() * 0.5,
                      ease: "linear",
                    }}
                  />
                ))}
              </g>
            )}
          </g>


          {/* Z-Lines (Move) */}
          <line
            x1={zLeft}
            y1="80"
            x2={zLeft}
            y2="330"
            stroke="#0f172a"
            strokeWidth="8"
            strokeLinecap="square"
          />
          <line
            x1={zRight}
            y1="80"
            x2={zRight}
            y2="330"
            stroke="#0f172a"
            strokeWidth="8"
            strokeLinecap="square"
          />
          <text
            x={zLeft}
            y="70"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#0f172a"
          >
            Z-Line
          </text>
          <text
            x={zRight}
            y="70"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#0f172a"
          >
            Z-Line
          </text>


          {/* M-Line (Static) */}
          <line
            x1={CENTER}
            y1="90"
            x2={CENTER}
            y2="320"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="6,4"
          />
          <text
            x={CENTER}
            y="340"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#94a3b8"
          >
            M-Line
          </text>


          {/* Thin Filaments (Actin) - Move with Z-Lines */}
          {/* Left Side */}
          {[110, 160, 210, 260].map((y, i) => (
            <line
              key={`actin-l-${i}`}
              x1={zLeft + 4}
              y1={y}
              x2={actinLeftTip}
              y2={y}
              stroke="#a8a29e"
              strokeWidth="4"
            />
          ))}
          {/* Right Side */}
          {[110, 160, 210, 260].map((y, i) => (
            <line
              key={`actin-r-${i}`}
              x1={zRight - 4}
              y1={y}
              x2={actinRightTip}
              y2={y}
              stroke="#a8a29e"
              strokeWidth="4"
            />
          ))}


          {/* Thick Filaments (Myosin) - Static A-Band */}
          {[135, 185, 235].map((y, i) => (
            <rect
              key={`myosin-${i}`}
              x={CENTER - MYOSIN_WIDTH / 2}
              y={y - 7}
              width={MYOSIN_WIDTH}
              height="14"
              fill="#f97316"
              rx="1"
            />
          ))}


          {/* --- ZONES HIGHLIGHTS --- */}


          {/* H-Zone (Yellow) */}
          <rect
            x={actinLeftTip}
            y="110"
            width={hZoneWidth}
            height="150"
            fill="#fbbf24"
            opacity="0.2"
          />
          {/* Label only if visible */}
          {hZoneWidth > 10 && (
            <text
              x={CENTER}
              y="125"
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="12"
              fontWeight="bold"
            >
              H-Zone
            </text>
          )}


          {/* I-Band (Green) - Left Side */}
          <rect
            x={zLeft}
            y="90"
            width={iBandWidth}
            height="200"
            fill="#22c55e"
            opacity="0.2"
          />
          {/* I-Band (Green) - Right Side */}
          <rect
            x={zRight - iBandWidth}
            y="90"
            width={iBandWidth}
            height="200"
            fill="#22c55e"
            opacity="0.2"
          />
          <text
            x={zLeft + iBandWidth / 2}
            y="105"
            textAnchor="middle"
            fill="#22c55e"
            fontSize="12"
            fontWeight="bold"
          >
            I-Band
          </text>
          <text
            x={zRight - iBandWidth / 2}
            y="105"
            textAnchor="middle"
            fill="#22c55e"
            fontSize="12"
            fontWeight="bold"
          >
            I-Band
          </text>


          {/* A-Band Marker (Static) */}
          <line
            x1={CENTER - MYOSIN_WIDTH / 2}
            y1="290"
            x2={CENTER + MYOSIN_WIDTH / 2}
            y2="290"
            stroke="#ef4444"
            strokeWidth="1"
          />
          <text
            x={CENTER}
            y="305"
            textAnchor="middle"
            fill="#ef4444"
            fontSize="12"
            fontWeight="bold"
          >
            A-Band (Constant)
          </text>
        </svg>
      </div>


      {/* CONTROLS */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mt-4 border-l-4 border-blue-500 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-grow w-full">
          <div className="flex justify-between mb-2">
            <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center">
              <Sliders size={18} className="mr-2" /> Contraction Level
            </span>
            <span className="font-mono font-bold text-blue-600">
              {contraction}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={contraction}
            onChange={(e) => setContraction(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1 font-bold">
            <span>Relaxed</span>
            <span>Contracted</span>
          </div>
        </div>


        <div className="min-w-[200px] text-center">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">
            Sarcomere State
          </h3>
          <div
            className={`text-lg font-bold ${contraction === 100
              ? "text-green-500"
              : "text-slate-800 dark:text-white"
              }`}
          >
            {getStatus()}
          </div>
        </div>


        <Button onClick={onComplete}>Finish Overview</Button>
      </div>
    </div>
  );
};


// --- QUIZ COMPONENT ---
const Quiz = ({ onCorrect, onClose }) => {
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);


  const checkAnswer = (answer) => {
    setAnswered(true);
    if (answer === "Ca²⁺") {
      setIsCorrect(true);
      setTimeout(onCorrect, 1500);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl max-w-md w-full border-2 border-indigo-500"
      >
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white flex items-center">
          <Activity className="mr-2 text-indigo-500" /> Knowledge Check
        </h2>
        <p className="mb-6 text-lg text-slate-600 dark:text-slate-300">
          Which ion directly binds to troponin to expose binding sites?
        </p>


        <div className="grid grid-cols-2 gap-3">
          {["Na⁺", "Ca²⁺", "K⁺", "ATP"].map((opt) => (
            <button
              key={opt}
              disabled={answered}
              onClick={() => checkAnswer(opt)}
              className={`p-4 rounded-xl font-bold text-lg transition-all ${answered
                ? opt === "Ca²⁺"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-400"
                : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-slate-700 dark:text-white"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>


        {answered && (
          <div
            className={`mt-4 text-center font-bold text-lg ${isCorrect ? "text-green-600" : "text-red-500"
              }`}
          >
            {isCorrect ? "Correct! +10 Points" : "Try Again!"}
          </div>
        )}


        {answered && !isCorrect && (
          <Button onClick={() => setAnswered(false)} className="w-full mt-4">
            Retry
          </Button>
        )}
      </motion.div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---


export default function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [maxLevelUnlocked, setMaxLevelUnlocked] = useState(5); // Unlocked all levels including 5
  const [showQuiz, setShowQuiz] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showOutcomes, setShowOutcomes] = useState(false);


  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);


  const handleLevelComplete = () => {
    if (currentLevel === maxLevelUnlocked) {
      const nextLvl = currentLevel + 1;
      setScore((s) => s + 5);
      setMaxLevelUnlocked(nextLvl);
    }
  };


  const handleQuizCorrect = () => {
    setScore((s) => s + 10);
    setShowQuiz(false);
    handleLevelComplete();
    // Auto advance after quiz
    if (currentLevel === 2) setCurrentLevel(3);
  };


  const renderContent = () => {
    if (showOutcomes) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl">
          <CheckCircle size={64} className="text-green-500 mb-4" />
          <h2 className="text-3xl font-bold mb-2 text-indigo-900 dark:text-white">
            Simulation Complete!
          </h2>
          <p className="text-xl mb-6 text-slate-600">Final Score: {score}</p>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg max-w-lg w-full text-left">
            <h3 className="font-bold text-gray-500 text-sm mb-4 uppercase tracking-wider">
              Learning Outcomes Achieved
            </h3>
            <ul className="space-y-3">
              {[
                "10.2 a: Structure of NMJ",
                "10.2 b: Transmission of Impulse",
                "10.2 c: Sarcomere Structure",
                "10.2 d: Sliding Filament Theory",
              ].map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-center text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle size={16} className="text-green-500 mr-2" />{" "}
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
          <Button onClick={() => window.location.reload()} className="mt-8">
            Restart Simulation
          </Button>
        </div>
      );
    }


    switch (currentLevel) {
      case 1:
        return <Level1 onComplete={() => setMaxLevelUnlocked(2)} />;
      case 2:
        return (
          <Level2
            onComplete={() => {
              /* Wait for quiz */
            }}
            onQuizStart={() => setShowQuiz(true)}
          />
        );
      case 3:
        return (
          <Level3
            onComplete={() => {
              handleLevelComplete();
              setCurrentLevel(4);
            }}
          />
        );
      case 4:
        return (
          <Level4
            onComplete={() => {
              handleLevelComplete();
              setCurrentLevel(5);
            }}
          />
        );
      case 5:
        return <Level5 onComplete={() => setShowOutcomes(true)} />;
      default:
        return <Level1 />;
    }
  };


  return (
    <div
      className={`min-h-screen p-4 md:p-8 font-sans transition-colors duration-300 ${darkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"
        }`}
    >
      {/* HEADER */}
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            BioSim: Muscle Contraction
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Aisyahmiza NMJ & SFT Project
          </p>
        </div>


        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Current Score
            </span>
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {score} XP
            </span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>


      {/* PROGRESS BAR */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex justify-between mb-2 px-2">
          {["NMJ", "Impulse", "Structure", "SFT Cycle", "Overview"].map(
            (label, idx) => (
              <span
                key={idx}
                className={`text-xs font-bold ${currentLevel > idx
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400"
                  }`}
              >
                {label}
              </span>
            )
          )}
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentLevel / 5) * 100}%` }}
          />
        </div>
      </div>


      {/* MAIN GAME CONTAINER */}
      <main className="max-w-5xl mx-auto h-[600px] md:h-[650px] relative">
        <div className="absolute -top-4 -right-4 md:right-0 flex gap-2 z-10">
          {currentLevel === 5 && (
            <Button
              onClick={() => setShowOutcomes(true)}
              className="bg-green-600 hover:bg-green-700 shadow-lg text-sm"
            >
              Finish Simulation
            </Button>
          )}
          {maxLevelUnlocked > currentLevel && (
            <Button
              onClick={() => setCurrentLevel(currentLevel + 1)}
              className="text-sm py-1"
            >
              Next Level <ArrowRight size={14} className="ml-1 inline" />
            </Button>
          )}
        </div>


        {/* Canvas Area */}
        <div className="h-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-4 md:p-6 border border-slate-100 dark:border-slate-700">
          {renderContent()}
        </div>
      </main>


      {/* FOOTER / NAV */}
      <nav className="max-w-5xl mx-auto mt-6 grid grid-cols-5 gap-2 md:gap-4">
        {[1, 2, 3, 4, 5].map((lvl) => (
          <button
            key={lvl}
            onClick={() => lvl <= maxLevelUnlocked && setCurrentLevel(lvl)}
            disabled={lvl > maxLevelUnlocked}
            className={`py-3 rounded-xl font-bold text-sm transition-all flex flex-col md:flex-row items-center justify-center gap-2
              ${currentLevel === lvl
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : lvl <= maxLevelUnlocked
                  ? "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed opacity-60"
              }`}
          >
            {lvl === 1 && <Microscope size={18} />}
            {lvl === 2 && <Zap size={18} />}
            {lvl === 3 && <Settings size={18} />}
            {lvl === 4 && <Activity size={18} />}
            {lvl === 5 && <Sliders size={18} />}
            <span className="hidden md:inline">Level {lvl}</span>
          </button>
        ))}
      </nav>


      {/* MODALS */}
      {showQuiz && (
        <Quiz
          onCorrect={handleQuizCorrect}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}