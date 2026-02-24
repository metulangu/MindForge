import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { games } from '@/config/games';
import { cn } from '@/lib/utils';
import { ArrowRight, Filter, ChevronDown, Check } from 'lucide-react';

export function Dashboard() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    games.forEach(game => {
      game.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  const filteredGames = useMemo(() => {
    if (!selectedTag) return games;
    return games.filter(game => game.tags.includes(selectedTag));
  }, [selectedTag]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "flex items-center gap-3 px-5 py-2.5 rounded-2xl font-bold transition-all border shadow-sm",
              selectedTag 
                ? "bg-indigo-50 border-indigo-200 text-indigo-600" 
                : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300"
            )}
          >
            <Filter size={18} className={selectedTag ? "text-indigo-500" : "text-slate-400"} />
            <span className="text-sm">
              {selectedTag ? `Category: ${selectedTag}` : "Filter by Category"}
            </span>
            <ChevronDown 
              size={18} 
              className={cn("transition-transform duration-300", isMenuOpen && "rotate-180")} 
            />
          </button>

          {selectedTag && (
            <button 
              onClick={() => setSelectedTag(null)}
              className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Clear Filter
            </button>
          )}
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
                className="flex flex-wrap gap-3 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner"
              >
                <motion.button
                  variants={{
                    hidden: { opacity: 0, y: 10, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  onClick={() => setSelectedTag(null)}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border flex items-center gap-2",
                    !selectedTag 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] scale-105" 
                      : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
                  )}
                >
                  All Games <span className="text-[10px] opacity-60">({games.length})</span>
                </motion.button>
                {tagCounts.map(([tag, count]) => (
                  <motion.button
                    key={tag}
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.9 },
                      visible: { opacity: 1, y: 0, scale: 1 }
                    }}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border flex items-center gap-2",
                      selectedTag === tag
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] scale-105"
                        : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
                    )}
                  >
                    {tag} <span className={cn("text-[10px] opacity-60", selectedTag === tag ? "text-white" : "text-slate-400")}>({count})</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredGames.map((game, index) => {
            const Icon = game.icon;
            return (
              <motion.div
                layout
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={game.path}
                  className="group block h-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 relative overflow-hidden flex flex-col"
                >
                  <div className={cn("absolute top-0 right-0 p-24 rounded-full opacity-5 transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500", game.color)} />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0", game.color)}>
                        <Icon size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                        {game.title}
                      </h3>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {game.description}
                    </p>

                    <div className="flex-grow flex flex-col justify-end">
                      <div className="flex flex-wrap gap-1.5 mb-4 max-w-[80%]">
                        {game.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedTag(tag);
                            }}
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider cursor-pointer transition-colors",
                              selectedTag === tag 
                                ? "bg-indigo-600 text-white" 
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-end text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                        Play Now <ArrowRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
