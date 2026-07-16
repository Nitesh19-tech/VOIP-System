import DashboardCard from "./DashboardCard";

const IconBox = ({ icon: Icon, colorClass }) => (
  <div
    className={`
      h-14
      w-14
      rounded-2xl
      flex
      items-center
      justify-center
      ${colorClass}
      shadow-lg
      transition-all
      duration-300
      group-hover:scale-110
      group-hover:rotate-6
    `}
  >
    <Icon
      size={26}
      className="text-white"
      strokeWidth={2.2}
    />
  </div>
);

export default function StatCard({
  title,
  value,
  icon,
  colorClass,
  subtext,
}) {

  const glowColor = colorClass
    .split(" ")[0]
    .replace("/10", "");

  return (

    <DashboardCard
      className="
        group
        relative
        overflow-hidden

        rounded-2xl

        border
        border-slate-800

        bg-white
        dark:bg-slate-900

        p-6

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-blue-500/40
        hover:shadow-2xl
      "
    >

      {/* Glow */}

      <div
        className={`
          absolute
          -right-10
          -bottom-10

          h-40
          w-40

          rounded-full

          blur-3xl

          opacity-0

          group-hover:opacity-20

          transition-all
          duration-500

          ${glowColor}
        `}
      />

      {/* Content */}

      <div className="relative flex justify-between items-start">

        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-[0.18em]
              font-semibold
              text-slate-500
            "
          >

            {title}

          </p>

          <h2
            className="
              mt-2

              text-4xl

              font-extrabold

              tracking-tight

              text-slate-900
              dark:text-white
            "
          >

            {value}

          </h2>

          {subtext && (

            <div className="mt-4 flex items-center gap-2">

              <span
                className="
                  h-2
                  w-2

                  rounded-full

                  bg-emerald-500

                  animate-pulse
                "
              />

              <span
                className="
                  text-xs

                  font-medium

                  text-slate-500
                "
              >

                {subtext}

              </span>

            </div>

          )}

        </div>

        <IconBox
          icon={icon}
          colorClass={colorClass}
        />

      </div>

      {/* Bottom Border */}

      <div
        className="
          absolute

          bottom-0
          left-0

          h-1
          w-0

          bg-gradient-to-r
          from-blue-500
          to-cyan-400

          transition-all
          duration-500

          group-hover:w-full
        "
      />

    </DashboardCard>

  );

}