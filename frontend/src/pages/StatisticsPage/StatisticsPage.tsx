import { useGeneralStats } from './hooks/useGeneralStats';
import { useTopMaterials } from './hooks/useTopMaterials';
import { useTopContributors } from './hooks/useTopContributors';

import GeneralStats from './components/GeneralStats';
import TopMaterials from './components/TopMaterials';
import TopContributors from './components/TopContributors';

const StatisticsPage = () => {
    const generalStats = useGeneralStats();
	const topMaterials = useTopMaterials();
	const topContributors = useTopContributors();

  return (
    <div className=" p-12 min-h-screen overflow-y-auto scrollbar-hide h-[100vh] pb-36">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight">
        Platform Statistics
      </h1>

      {/* Total Stats Cards */}
	  {generalStats && <GeneralStats generalStats={generalStats} />}

      {/* Leaderboard Card */}
	  {topMaterials && <TopMaterials mostViewedMaterials={topMaterials.mostViewedMaterials} mostDownloadedMaterials={topMaterials.mostDownloadedMaterials} setMaterialsRange={topMaterials.setMaterialsRange} />}

      {/* Top Contributors Card */}
	  {topContributors && <TopContributors topContributors={topContributors.topContributors} />}

    </div>
  );
};

export default StatisticsPage;

