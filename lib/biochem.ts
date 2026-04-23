export type AminoAcid = {
  oneLetter: string;
  threeLetter: string;
  name: string;
  readingJa: string;
};

export type CodonEntry = {
  codon: string;
  aminoAcid: AminoAcid | null;
};

export type AminoSection = {
  id: number;
  title: string;
  letters: string[];
};

export const AMINO_ACIDS: AminoAcid[] = [
  { oneLetter: "A", threeLetter: "Ala", name: "Alanine", readingJa: "アラニン" },
  { oneLetter: "R", threeLetter: "Arg", name: "Arginine", readingJa: "アルギニン" },
  { oneLetter: "N", threeLetter: "Asn", name: "Asparagine", readingJa: "アスパラギン" },
  { oneLetter: "D", threeLetter: "Asp", name: "Aspartic acid", readingJa: "アスパラギン酸" },
  { oneLetter: "C", threeLetter: "Cys", name: "Cysteine", readingJa: "システイン" },
  { oneLetter: "E", threeLetter: "Glu", name: "Glutamic acid", readingJa: "グルタミン酸" },
  { oneLetter: "Q", threeLetter: "Gln", name: "Glutamine", readingJa: "グルタミン" },
  { oneLetter: "G", threeLetter: "Gly", name: "Glycine", readingJa: "グリシン" },
  { oneLetter: "H", threeLetter: "His", name: "Histidine", readingJa: "ヒスチジン" },
  { oneLetter: "I", threeLetter: "Ile", name: "Isoleucine", readingJa: "イソロイシン" },
  { oneLetter: "L", threeLetter: "Leu", name: "Leucine", readingJa: "ロイシン" },
  { oneLetter: "K", threeLetter: "Lys", name: "Lysine", readingJa: "リシン" },
  { oneLetter: "M", threeLetter: "Met", name: "Methionine", readingJa: "メチオニン" },
  { oneLetter: "F", threeLetter: "Phe", name: "Phenylalanine", readingJa: "フェニルアラニン" },
  { oneLetter: "P", threeLetter: "Pro", name: "Proline", readingJa: "プロリン" },
  { oneLetter: "S", threeLetter: "Ser", name: "Serine", readingJa: "セリン" },
  { oneLetter: "T", threeLetter: "Thr", name: "Threonine", readingJa: "スレオニン" },
  { oneLetter: "W", threeLetter: "Trp", name: "Tryptophan", readingJa: "トリプトファン" },
  { oneLetter: "Y", threeLetter: "Tyr", name: "Tyrosine", readingJa: "チロシン" },
  { oneLetter: "V", threeLetter: "Val", name: "Valine", readingJa: "バリン" }
];

const aminoByLetter = new Map(AMINO_ACIDS.map((item) => [item.oneLetter, item] as const));

const toEntry = (codon: string, oneLetter: string): CodonEntry => ({
  codon,
  aminoAcid: aminoByLetter.get(oneLetter) ?? null
});

export const CODON_TABLE: CodonEntry[] = [
  toEntry("UUU", "F"),
  toEntry("UUC", "F"),
  toEntry("UUA", "L"),
  toEntry("UUG", "L"),
  toEntry("UCU", "S"),
  toEntry("UCC", "S"),
  toEntry("UCA", "S"),
  toEntry("UCG", "S"),
  toEntry("UAU", "Y"),
  toEntry("UAC", "Y"),
  { codon: "UAA", aminoAcid: null },
  { codon: "UAG", aminoAcid: null },
  toEntry("UGU", "C"),
  toEntry("UGC", "C"),
  { codon: "UGA", aminoAcid: null },
  toEntry("UGG", "W"),
  toEntry("CUU", "L"),
  toEntry("CUC", "L"),
  toEntry("CUA", "L"),
  toEntry("CUG", "L"),
  toEntry("CCU", "P"),
  toEntry("CCC", "P"),
  toEntry("CCA", "P"),
  toEntry("CCG", "P"),
  toEntry("CAU", "H"),
  toEntry("CAC", "H"),
  toEntry("CAA", "Q"),
  toEntry("CAG", "Q"),
  toEntry("CGU", "R"),
  toEntry("CGC", "R"),
  toEntry("CGA", "R"),
  toEntry("CGG", "R"),
  toEntry("AUU", "I"),
  toEntry("AUC", "I"),
  toEntry("AUA", "I"),
  toEntry("AUG", "M"),
  toEntry("ACU", "T"),
  toEntry("ACC", "T"),
  toEntry("ACA", "T"),
  toEntry("ACG", "T"),
  toEntry("AAU", "N"),
  toEntry("AAC", "N"),
  toEntry("AAA", "K"),
  toEntry("AAG", "K"),
  toEntry("AGU", "S"),
  toEntry("AGC", "S"),
  toEntry("AGA", "R"),
  toEntry("AGG", "R"),
  toEntry("GUU", "V"),
  toEntry("GUC", "V"),
  toEntry("GUA", "V"),
  toEntry("GUG", "V"),
  toEntry("GCU", "A"),
  toEntry("GCC", "A"),
  toEntry("GCA", "A"),
  toEntry("GCG", "A"),
  toEntry("GAU", "D"),
  toEntry("GAC", "D"),
  toEntry("GAA", "E"),
  toEntry("GAG", "E"),
  toEntry("GGU", "G"),
  toEntry("GGC", "G"),
  toEntry("GGA", "G"),
  toEntry("GGG", "G")
];

export const AMINO_SECTIONS: AminoSection[] = [
  { id: 1, title: "Section 1", letters: ["A", "V", "L", "I"] },
  { id: 2, title: "Section 2", letters: ["M", "F", "W", "Y"] },
  { id: 3, title: "Section 3", letters: ["S", "T", "N", "Q"] },
  { id: 4, title: "Section 4", letters: ["D", "E", "K", "R"] },
  { id: 5, title: "Section 5", letters: ["C", "H", "G", "P"] }
];
