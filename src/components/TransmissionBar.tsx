// TransmissionBar — strip de telemetría que va apenas debajo del hero.
// Marquee infinito con coordenadas, status, próximo waypoint, etc.
// Refuerza la idea de que la home es una "consola transmitiendo".

const ITEMS = [
  "▸ TRANSMITIENDO DESDE 38°00'S · 057°33'W",
  "ATLÁNTICO SUR",
  "SINCE 2024",
  "NODES ACTIVE · 312/312",
  "FREQUENCY · 2.4 GHz",
  "SIGNAL STRENGTH · −42dB",
  "NEXT WAYPOINT · MDP-PORT",
  "BEARING 198° T · 2.4nm",
  "ETA 03:14:18 UTC",
  "OPEN COMMUNITY · OPEN SOURCE",
  "BUILT IN MAR DEL PLATA",
];

export default function TransmissionBar() {
  // Duplico para que el marquee loop sin saltos visibles.
  const seq = [...ITEMS, ...ITEMS];

  return (
    <div className="transmission-bar" aria-hidden>
      <div className="transmission-bar-rail">
        <div className="transmission-marquee">
          {seq.map((item, i) => (
            <span key={i} className="transmission-item">
              {item}
              <span className="transmission-sep">●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
