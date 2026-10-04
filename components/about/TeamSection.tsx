import { getSiteSettings } from "@/lib/site";
import { getTeam } from "@/lib/team";

export default async function TeamSection() {
  const [settings, team] = await Promise.all([getSiteSettings(), getTeam()]);

  // Dashboard switch: the section can be unpublished without deleting anyone.
  if (!settings.showTeamSection) return null;

  // Nothing published yet: the whole section is hidden rather than showing an
  // empty "our people" block.
  if (team.length === 0) return null;

  return (
    <section id="team" className="section bg-light-bg">
      <div className="bt-container">
        <div className="mb-14 text-center" data-aos="fade-up">
          <span className="mb-3 inline-block font-semibold text-accent">
            THE PEOPLE
          </span>
          <h2 className="mb-4 text-[2rem] font-bold leading-[1.2] lg:text-[1.75rem]">
            Small team, no hand-offs
          </h2>
          <p className="mx-auto mb-0 max-w-[640px] text-[16px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
            Everyone who touches your project is on this page. You talk to the
            people doing the work.
          </p>
        </div>

        <div
          className={`grid gap-6 sm:grid-cols-2 ${
            team.length > 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {team.map((member, index) => (
            <div
              key={member.name}
              data-aos="fade-up"
              data-aos-delay={(index % 4) * 100}
              className="group overflow-hidden rounded-2xl bg-white text-center shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
            >
              <div className="relative h-[220px] overflow-hidden bg-light-bg">
                {member.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  </>
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-4xl font-bold text-[rgba(33,37,41,0.25)]">
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3 className="mb-1 text-lg font-bold">{member.name}</h3>
                {member.role ? (
                  <p className="mb-3 text-sm font-medium text-accent">
                    {member.role}
                  </p>
                ) : null}
                {member.bio ? (
                  <p className="m-0 text-[14px] leading-[1.7] text-[rgba(33,37,41,0.7)]">
                    {member.bio}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
