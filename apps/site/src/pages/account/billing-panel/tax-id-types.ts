export type StripeTaxIdType = {
  country: string;
  shortCode: string;
  description: string;
  example: string;
};

export const stripeTaxIdTypes: StripeTaxIdType[] = [
  {
    country: "Australia",
    shortCode: "au_abn",
    description: "Australian Business Number (AU ABN)",
    example: "12345678912",
  },
  {
    country: "Australia",
    shortCode: "au_arn",
    description: "Australian Taxation Office Reference Number",
    example: "123456789123",
  },
  {
    country: "Austria",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "ATU12345678",
  },
  {
    country: "Belgium",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "BE0123456789",
  },
  {
    country: "Brazil",
    shortCode: "br_cnpj",
    description: "Brazilian CNPJ number",
    example: "01.234.456/5432-10",
  },
  {
    country: "Brazil",
    shortCode: "br_cpf",
    description: "Brazilian CPF number",
    example: "123.456.789-87",
  },
  {
    country: "Bulgaria",
    shortCode: "bg_uic",
    description: "Bulgaria Unified Identification Code",
    example: "123456789",
  },
  {
    country: "Bulgaria",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "BG0123456789",
  },
  {
    country: "Canada",
    shortCode: "ca_bn",
    description: "Canadian BN",
    example: "123456789",
  },
  {
    country: "Canada",
    shortCode: "ca_gst_hst",
    description: "Canadian GST/HST number",
    example: "123456789RT0002",
  },
  {
    country: "Canada",
    shortCode: "ca_pst_bc",
    description: "Canadian PST number (British Columbia)",
    example: "PST-1234-5678",
  },
  {
    country: "Canada",
    shortCode: "ca_pst_mb",
    description: "Canadian PST number (Manitoba)",
    example: "123456-7",
  },
  {
    country: "Canada",
    shortCode: "ca_pst_sk",
    description: "Canadian PST number (Saskatchewan)",
    example: "1234567",
  },
  {
    country: "Canada",
    shortCode: "ca_qst",
    description: "Canadian QST number (Québec)",
    example: "1234567890TQ1234",
  },
  {
    country: "Chile",
    shortCode: "cl_tin",
    description: "Chilean TIN",
    example: "12.345.678-K",
  },
  {
    country: "Croatia",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "HR12345678912",
  },
  {
    country: "Cyprus",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "CY12345678Z",
  },
  {
    country: "Czech Republic",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "CZ1234567890",
  },
  {
    country: "Denmark",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "DK12345678",
  },
  {
    country: "Egypt",
    shortCode: "eg_tin",
    description: "Egyptian Tax Identification Number",
    example: "123456789",
  },
  {
    country: "Estonia",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "EE123456789",
  },
  {
    country: "EU",
    shortCode: "eu_oss_vat",
    description: "European One Stop Shop VAT number for non-Union scheme",
    example: "EU123456789",
  },
  {
    country: "Finland",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "FI12345678",
  },
  {
    country: "France",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "FRAB123456789",
  },
  {
    country: "Georgia",
    shortCode: "ge_vat",
    description: "Georgian VAT",
    example: "123456789",
  },
  {
    country: "Germany",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "DE123456789",
  },
  {
    country: "Greece",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "EL123456789",
  },
  {
    country: "Hong Kong",
    shortCode: "hk_br",
    description: "Hong Kong BR number",
    example: "12345678",
  },
  {
    country: "Hungary",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "HU12345678912",
  },
  {
    country: "Hungary",
    shortCode: "hu_tin",
    description: "Hungary tax number (adószám)",
    example: "12345678-1-23",
  },
  {
    country: "Iceland",
    shortCode: "is_vat",
    description: "Icelandic VAT",
    example: "123456",
  },
  {
    country: "India",
    shortCode: "in_gst",
    description: "Indian GST number",
    example: "12ABCDE3456FGZH",
  },
  {
    country: "Indonesia",
    shortCode: "id_npwp",
    description: "Indonesian NPWP number",
    example: "12.345.678.9-012.345",
  },
  {
    country: "Ireland",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "IE1234567AB",
  },
  {
    country: "Israel",
    shortCode: "il_vat",
    description: "Israel VAT",
    example: "000012345",
  },
  {
    country: "Italy",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "IT12345678912",
  },
  {
    country: "Japan",
    shortCode: "jp_cn",
    description: "Japanese Corporate Number (*Hōjin Bangō*)",
    example: "1234567891234",
  },
  {
    country: "Japan",
    shortCode: "jp_rn",
    description:
      "Japanese Registered Foreign Businesses' Registration Number (*Tōroku Kokugai Jigyōsha no Tōroku Bangō*)",
    example: "12345",
  },
  {
    country: "Japan",
    shortCode: "jp_trn",
    description: "Japanese Tax Registration Number (*Tōroku Bangō*)",
    example: "T1234567891234",
  },
  {
    country: "Kenya",
    shortCode: "ke_pin",
    description: "Kenya Revenue Authority Personal Identification Number",
    example: "P000111111A",
  },
  {
    country: "Latvia",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "LV12345678912",
  },
  {
    country: "Liechtenstein",
    shortCode: "li_uid",
    description: "Liechtensteinian UID number",
    example: "CHE123456789",
  },
  {
    country: "Lithuania",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "LT123456789123",
  },
  {
    country: "Luxembourg",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "LU12345678",
  },
  {
    country: "Malaysia",
    shortCode: "my_frp",
    description: "Malaysian FRP number",
    example: "12345678",
  },
  {
    country: "Malaysia",
    shortCode: "my_itn",
    description: "Malaysian ITN",
    example: "C 1234567890",
  },
  {
    country: "Malaysia",
    shortCode: "my_sst",
    description: "Malaysian SST number",
    example: "A12-3456-78912345",
  },
  {
    country: "Malta",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "MT12345678",
  },
  {
    country: "Mexico",
    shortCode: "mx_rfc",
    description: "Mexican RFC number",
    example: "ABC010203AB9",
  },
  {
    country: "Netherlands",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "NL123456789B12",
  },
  {
    country: "New Zealand",
    shortCode: "nz_gst",
    description: "New Zealand GST number",
    example: "123456789",
  },
  {
    country: "Norway",
    shortCode: "no_vat",
    description: "Norwegian VAT number",
    example: "123456789MVA",
  },
  {
    country: "Philippines",
    shortCode: "ph_tin",
    description: "Philippines Tax Identification Number",
    example: "123456789012",
  },
  {
    country: "Poland",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "PL1234567890",
  },
  {
    country: "Portugal",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "PT123456789",
  },
  {
    country: "Romania",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "RO1234567891",
  },
  {
    country: "Russia",
    shortCode: "ru_inn",
    description: "Russian INN",
    example: "1234567891",
  },
  {
    country: "Russia",
    shortCode: "ru_kpp",
    description: "Russian KPP",
    example: "123456789",
  },
  {
    country: "Saudi Arabia",
    shortCode: "sa_vat",
    description: "Saudi Arabia VAT",
    example: "123456789012345",
  },
  {
    country: "Singapore",
    shortCode: "sg_gst",
    description: "Singaporean GST",
    example: "M12345678X",
  },
  {
    country: "Singapore",
    shortCode: "sg_uen",
    description: "Singaporean UEN",
    example: "123456789F",
  },
  {
    country: "Slovakia",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "SK1234567891",
  },
  {
    country: "Slovenia",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "SI12345678",
  },
  {
    country: "Slovenia",
    shortCode: "si_tin",
    description: "Slovenia tax number (davčna številka)",
    example: "12345678",
  },
  {
    country: "South Africa",
    shortCode: "za_vat",
    description: "South African VAT number",
    example: "4123456789",
  },
  {
    country: "South Korea",
    shortCode: "kr_brn",
    description: "Korean BRN",
    example: "123-45-67890",
  },
  {
    country: "Spain",
    shortCode: "es_cif",
    description: "Spanish NIF number (previously Spanish CIF number)",
    example: "A12345678",
  },
  {
    country: "Spain",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "ESA1234567Z",
  },
  {
    country: "Sweden",
    shortCode: "eu_vat",
    description: "European VAT number",
    example: "SE123456789123",
  },
  {
    country: "Switzerland",
    shortCode: "ch_vat",
    description: "Switzerland VAT number",
    example: "CHE-123.456.789 MWST",
  },
  {
    country: "Taiwan",
    shortCode: "tw_vat",
    description: "Taiwanese VAT",
    example: "12345678",
  },
  {
    country: "Thailand",
    shortCode: "th_vat",
    description: "Thai VAT",
    example: "1234567891234",
  },
  {
    country: "Turkey",
    shortCode: "tr_tin",
    description: "Turkish Tax Identification Number",
    example: "0123456789",
  },
  {
    country: "Ukraine",
    shortCode: "ua_vat",
    description: "Ukrainian VAT",
    example: "123456789",
  },
  {
    country: "United Arab Emirates",
    shortCode: "ae_trn",
    description: "United Arab Emirates TRN",
    example: "123456789012345",
  },
  {
    country: "United Kingdom",
    shortCode: "eu_vat",
    description: "Northern Ireland VAT number",
    example: "XI123456789",
  },
  {
    country: "United Kingdom",
    shortCode: "gb_vat",
    description: "United Kingdom VAT number",
    example: "GB123456789",
  },
  {
    country: "United States",
    shortCode: "us_ein",
    description: "United States EIN",
    example: "12-3456789",
  },
];
