import Link from "next/link";
import {socialLinks} from "@/lib/data/socialLinks";
import {tags} from "@/lib/data/tags";
import SearchBtn from "./_SearchBtn";
const Aside = () => {
 

    return (    <aside className="lg:w-80 space-y-6">
            {/* Search Widget */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Buscar</h3>
              <div className="relative">
               <SearchBtn/>
              </div>
            </div>

            {/* Tags Widget */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Veja Também</h3>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 12).map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/posts/search/${tag.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    {tag.name}
                    <span className="text-xs opacity-60">({tag.count})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Links Widget */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Conecte-se</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-700 ${social.color} hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 hover:scale-105`}
                  >
                    {social.icon}
                    <span className="text-sm font-medium">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside> );
}
 
export default Aside;