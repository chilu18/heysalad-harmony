import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Filter,
  Layers,
  ListChecks,
  Search,
  ShieldCheck,
  Sparkles,
  Target
} from 'lucide-react';
import { useAuth } from '../../App';
import {
  fetchProgramsWithProgress,
  fetchTrainingCatalog,
  syncBeumerTrainingCatalog,
  updateTrainingProgress,
  uploadTrainingAudio,
  TrainingCatalogPayload,
  TrainingProgramWithProgress
} from '../../services/trainingService';
import { generateTrainingModule } from '../../services/trainingModuleService';
import { elevenLabsConfigured } from '../../services/voiceService';

type BannerState = { type: 'success' | 'error'; message: string } | null;

const statusLabels: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed'
};

const Training = () => {
  const { currentUser, currentRole } = useAuth();

  const [programs, setPrograms] = useState<TrainingProgramWithProgress[]>([]);
  const [catalog, setCatalog] = useState<TrainingCatalogPayload | null>(null);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [syncingCatalog, setSyncingCatalog] = useState(false);
  const [generatingProgramId, setGeneratingProgramId] = useState<string | null>(null);
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [banner, setBanner] = useState<BannerState>(null);

  const applyBanner = (next: BannerState) => {
    setBanner(next);
    if (next) {
      window.setTimeout(() => setBanner(null), 6000);
    }
  };

  const loadData = useCallback(async () => {
    setLoadingPrograms(true);
    try {
      const [programPayload, catalogPayload] = await Promise.all([
        fetchProgramsWithProgress(currentUser?.id),
        fetchTrainingCatalog()
      ]);
      setPrograms(programPayload);
      setCatalog(catalogPayload);
    } catch (error: any) {
      applyBanner({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to load training programs.'
      });
    } finally {
      setLoadingPrograms(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const uniqueSegments = useMemo(() => {
    const segments = new Set<string>();
    programs.forEach((program) => {
      if (program.segment) {
        segments.add(program.segment);
      }
    });
    return ['all', ...Array.from(segments)];
  }, [programs]);

  const uniqueCertifications = useMemo(() => {
    const certs = new Set<string>();
    programs.forEach((program) => {
      program.certificationsRequired?.forEach((cert) => certs.add(cert));
    });
    return Array.from(certs);
  }, [programs]);

  const summary = useMemo(() => {
    const totals = {
      total: programs.length,
      completed: 0,
      inProgress: 0,
      notStarted: 0
    };

    programs.forEach((program) => {
      const progress = program.progress?.progressPercent ?? 0;
      if (progress >= 100) {
        totals.completed += 1;
      } else if (progress > 0) {
        totals.inProgress += 1;
      } else {
        totals.notStarted += 1;
      }
    });

    return totals;
  }, [programs]);

  const stats = useMemo(
    () => [
      {
        label: 'Training Programs',
        value: summary.total.toString(),
        detail: 'LLM-ready learning paths',
        icon: BookOpen,
        color: 'bg-primary'
      },
      {
        label: 'Equipment Categories',
        value: catalog
          ? catalog.equipmentCategories.filter((category) => category.trainingPrograms?.length).length.toString()
          : '—',
        detail: 'Mapped to BEUMER assets',
        icon: Layers,
        color: 'bg-secondary'
      },
      {
        label: 'Safety Certifications',
        value: uniqueCertifications.length.toString(),
        detail: 'Tracked for onboarding',
        icon: Award,
        color: 'bg-accent'
      },
      {
        label: 'Completed Modules',
        value: `${summary.completed}/${summary.total || 1}`,
        detail: summary.total
          ? `${Math.round((summary.completed / summary.total) * 100)}% complete`
          : 'Sync catalog to begin',
        icon: CheckCircle,
        color: 'bg-green-500'
      }
    ],
    [summary, catalog, uniqueCertifications.length]
  );

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSegment = selectedSegment === 'all' || program.segment === selectedSegment;
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        program.title.toLowerCase().includes(normalizedSearch) ||
        program.categoryLabel.toLowerCase().includes(normalizedSearch) ||
        program.segment.toLowerCase().includes(normalizedSearch);

      return matchesSegment && matchesSearch;
    });
  }, [programs, searchTerm, selectedSegment]);

  const handleSyncCatalog = async () => {
    setSyncingCatalog(true);
    try {
      const total = await syncBeumerTrainingCatalog();
      applyBanner({
        type: 'success',
        message: `Successfully synced ${total} programs to Firebase.`
      });
      await loadData();
    } catch (error: any) {
      applyBanner({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to sync catalog with Firebase.'
      });
    } finally {
      setSyncingCatalog(false);
    }
  };

  const handleGenerateModule = async (program: TrainingProgramWithProgress) => {
    if (!currentUser) {
      applyBanner({
        type: 'error',
        message: 'You need to be signed in to generate training modules.'
      });
      return;
    }

    setGeneratingProgramId(program.id);
    try {
      const module = await generateTrainingModule(program, {
        learnerName: currentUser.name,
        learnerRole: currentRole,
        certifications: program.certificationsRequired,
        includeAudio: elevenLabsConfigured
      });

      let audioUrl: string | null = null;
      if (module.audioBlob) {
        audioUrl = await uploadTrainingAudio(currentUser.id, program.id, module.audioBlob);
      }

      await updateTrainingProgress(currentUser.id, program.id, {
        status: 'completed',
        progressPercent: 100,
        completedAt: new Date().toISOString(),
        llmModule: {
          script: module.script,
          audioUrl
        }
      });

      applyBanner({
        type: 'success',
        message: 'Training module generated successfully.'
      });
      setExpandedProgramId(program.id);
      await loadData();
    } catch (error: any) {
      applyBanner({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to generate training module.'
      });
    } finally {
      setGeneratingProgramId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Training & Development</h1>
            <p className="text-gray-600 mt-1">
              Generate AI-assisted modules and track completion across BEUMER systems
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncCatalog}
              disabled={syncingCatalog}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-4 h-4" />
              {syncingCatalog ? 'Syncing…' : 'Sync Catalog to Firebase'}
            </button>
            {!elevenLabsConfigured && (
              <span className="text-xs text-gray-500">
                Add ElevenLabs keys to generate audio narration.
              </span>
            )}
          </div>
        </div>

        {banner && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              banner.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {banner.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 font-medium mt-1">{stat.detail}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900">Training Programs</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedSegment}
                  onChange={(event) => setSelectedSegment(event.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {uniqueSegments.map((segment) => (
                    <option key={segment} value={segment}>
                      {segment === 'all' ? 'All Segments' : segment}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loadingPrograms ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading training programs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => {
                const progressPercent = program.progress?.progressPercent ?? 0;
                const status = program.progress?.status ?? 'not_started';
                const isExpanded = expandedProgramId === program.id;
                const hasModule = Boolean(program.progress?.llmModule?.script);

                return (
                  <div
                    key={program.id}
                    className="bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02] flex flex-col"
                  >
                    <div className="p-6 space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
                          <Target className="w-4 h-4" />
                          {program.segment}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-xs font-semibold text-gray-700 border border-gray-200">
                          <Layers className="w-3 h-3" />
                          {program.categoryLabel}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{program.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                          <Clock className="w-4 h-4 text-primary" />
                          {program.durationDaysMin === program.durationDaysMax
                            ? `${program.durationDaysMin} days`
                            : `${program.durationDaysMin}-${program.durationDaysMax} days`}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <ListChecks className="w-4 h-4 text-secondary" />
                          Key Topics
                        </p>
                        <ul className="space-y-1">
                          {program.topics.map((topic, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {program.certificationsRequired.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            Required Certifications
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {program.certificationsRequired.map((cert, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-semibold text-gray-700 border border-gray-200"
                              >
                                <Award className="w-3 h-3 text-accent" />
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Status</span>
                          <span className="font-semibold text-gray-900">
                            {statusLabels[status] ?? 'Not Started'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Progress</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              progressPercent >= 100
                                ? 'bg-green-500'
                                : progressPercent > 0
                                ? 'bg-blue-500'
                                : 'bg-accent'
                            } transition-all duration-300`}
                            style={{ width: `${Math.max(progressPercent, 4)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 space-y-3">
                      <button
                        onClick={() => void handleGenerateModule(program)}
                        disabled={generatingProgramId === program.id}
                        className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <Sparkles className="w-4 h-4" />
                        {generatingProgramId === program.id
                          ? 'Generating Module…'
                          : hasModule
                          ? 'Regenerate LLM Module'
                          : 'Generate LLM Module'}
                      </button>

                      {hasModule && (
                        <>
                          <button
                            onClick={() =>
                              setExpandedProgramId(isExpanded ? null : program.id)
                            }
                            className="w-full border border-gray-300 hover:border-primary text-gray-700 hover:text-primary font-medium py-2 px-4 rounded-lg transition-colors"
                          >
                            {isExpanded ? 'Hide Module Details' : 'View Module Details'}
                          </button>
                          {isExpanded && (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                Latest Script
                              </p>
                              <div className="max-h-64 overflow-y-auto text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {program.progress?.llmModule?.script}
                              </div>
                              {program.progress?.llmModule?.audioUrl && (
                                <audio
                                  controls
                                  className="w-full"
                                  src={program.progress.llmModule.audioUrl}
                                >
                                  Your browser does not support the audio element.
                                </audio>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredPrograms.length === 0 && !loadingPrograms && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 font-medium">
                    No programs match your filters yet. Adjust the segment or search term to explore
                    more content.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              General Safety Requirements
            </h3>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Mandatory PPE</h4>
              <ul className="mt-2 space-y-1">
                {catalog?.generalSafety?.personalProtectiveEquipment?.mandatory?.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Task-Specific PPE</h4>
              <ul className="mt-2 space-y-1">
                {catalog?.generalSafety?.personalProtectiveEquipment?.taskSpecific?.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Pre-Operation Requirements</h4>
              <ul className="mt-2 space-y-1">
                {catalog?.generalSafety?.preOperationRequirements?.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Refresher Schedule & Implementation Notes
            </h3>
            <div className="space-y-3">
              {catalog?.trainingRefreshers?.map((refresher) => (
                <div
                  key={refresher.id}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{refresher.title}</p>
                    <p className="text-xs text-gray-500">Keep certifications current for onboarding</p>
                  </div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {refresher.frequency}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Implementation Guidance</h4>
              <ul className="mt-2 space-y-1">
                {catalog?.implementationNotes?.map((note, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
