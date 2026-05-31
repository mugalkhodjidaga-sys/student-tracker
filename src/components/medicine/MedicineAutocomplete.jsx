import { useEffect, useState } from 'react';
import { useStorage } from '../../providers/StorageContext';
import { Input } from '../ui/Input';
import { parseIssueSelection } from '../../utils/issueHelpers';
import { ISSUE_CHIPS } from '../../utils/constants';

export function MedicineAutocomplete({
  value,
  onChange,
  onSelectCatalog,
  issueType,
}) {
  const { medicineCatalogService } = useStorage();
  const [suggestions, setSuggestions] = useState([]);
  const [showList, setShowList] = useState(false);

  const issueTypes = parseIssueSelection(issueType, ISSUE_CHIPS);

  useEffect(() => {
    const q = value?.trim();
    if (!q && issueTypes.length === 0) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await medicineCatalogService.getSuggestions(
        q || '',
        issueTypes,
        10
      );
      setSuggestions(results);
    }, 150);

    return () => clearTimeout(timer);
  }, [value, issueType, medicineCatalogService, issueTypes.length]);

  function pick(item) {
    onSelectCatalog(item);
    setShowList(false);
  }

  return (
    <div className="relative">
      <Input
        label="Medicine *"
        placeholder="Type or pick from list…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowList(true)}
      />
      {issueTypes.length > 0 && !value && (
        <p className="mb-2 text-xs text-slate-500">
          Suggestions based on: {issueTypes.join(', ')}
        </p>
      )}
      {showList && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {suggestions.map((m) => (
            <li key={m.localId || m.name}>
              <button
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-emerald-50"
                onClick={() => pick(m)}
              >
                <span className="font-medium">{m.name}</span>
                <span className="ml-2 text-xs text-slate-500">
                  used {m.useCount || 0}×
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
