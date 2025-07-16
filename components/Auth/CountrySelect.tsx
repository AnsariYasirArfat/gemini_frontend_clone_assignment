import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Country } from "@/services/getCountryDialingCodes";
import { Input } from "@/components/ui/input";
import { FixedSizeList as List } from "react-window";

interface CountrySelectProps {
  countries: Country[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ITEM_HEIGHT = 40;
const MAX_VISIBLE = 8;

function getCountryLabel(countries: Country[], code: string) {
  const country = countries.find((c) => {
    const ccode =
      c.idd.root && c.idd.suffixes.length
        ? `${c.idd.root}${c.idd.suffixes[0]}`
        : "";
    return ccode === code;
  });
  return country ? `${country.name.common} (${code})` : "";
}

export function CountrySelect({
  countries,
  value,
  onChange,
  disabled,
}: CountrySelectProps) {
  const [search, setSearch] = useState("");

  const filteredCountries = useMemo(() => {
    if (!search) return countries;
    return countries.filter((country) => {
      const code =
        country.idd.root && country.idd.suffixes.length
          ? `${country.idd.root}${country.idd.suffixes[0]}`
          : "";
      return (
        country.name.common.toLowerCase().includes(search.toLowerCase()) ||
        code.includes(search)
      );
    });
  }, [countries, search]);

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const country = filteredCountries[index];
    const code =
      country.idd.root && country.idd.suffixes.length
        ? `${country.idd.root}${country.idd.suffixes[0]}`
        : "";
    return (
      <div style={style}>
        <SelectItem
          key={code + country.name.common}
          value={code}
          className="h-10"
        >
          {country.name.common} ({code})
        </SelectItem>
      </div>
    );
  };

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id="country" className="w-full">
        <SelectValue
          placeholder="Select Country"
          // @ts-ignore
          children={getCountryLabel(countries, value)}
        />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
        </div>
        {filteredCountries.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">No countries found.</div>
        ) : (
          <List
            height={
              Math.min(filteredCountries.length, MAX_VISIBLE) * ITEM_HEIGHT
            }
            itemCount={filteredCountries.length}
            itemSize={ITEM_HEIGHT}
            width="100%"
          >
            {Row}
          </List>
        )}
      </SelectContent>
    </Select>
  );
}
