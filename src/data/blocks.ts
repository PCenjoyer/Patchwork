import type { LocalizedBlockDefinition, LocalizedString, LocalizedVariableDefinition } from '../types';

const L = (ru: string, en: string): LocalizedString => ({ ru, en });

// ─── NDA ──────────────────────────────────────────────────────────────────────

const ndaParties: LocalizedVariableDefinition[] = [
  { key: 'disclosing_party', label: L('Раскрывающая сторона', 'Disclosing Party'), type: 'text', required: true, placeholder: L('ООО «Акме»', 'Acme Corporation') },
  { key: 'receiving_party', label: L('Получающая сторона', 'Receiving Party'), type: 'text', required: true, placeholder: L('Иван Иванов', 'John Doe') },
  { key: 'effective_date', label: L('Дата вступления в силу', 'Effective Date'), type: 'date', required: true },
  { key: 'governing_law', label: L('Применимое право (юрисдикция)', 'Governing Law (jurisdiction)'), type: 'text', required: true, placeholder: L('Российская Федерация', 'State of Delaware') },
];

export const ndaBlocks: LocalizedBlockDefinition[] = [
  {
    id: 'nda.header',
    title: L('Шапка и стороны', 'Header & Parties'),
    description: L('Название документа и идентификация сторон.', 'Document title and identification of the parties.'),
    required: true,
    body: L(
      'СОГЛАШЕНИЕ О НЕРАЗГЛАШЕНИИ\n\nНастоящее Соглашение о неразглашении («Соглашение») заключено {{effective_date}} между {{disclosing_party}} («Раскрывающая сторона») и {{receiving_party}} («Получающая сторона»).',
      'NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement (the "Agreement") is entered into as of {{effective_date}} by and between {{disclosing_party}} ("Disclosing Party") and {{receiving_party}} ("Receiving Party").',
    ),
    variables: ndaParties,
  },
  {
    id: 'nda.purpose',
    title: L('Цель', 'Purpose'),
    description: L('Определяет цель раскрытия информации.', 'Defines the purpose of the disclosure.'),
    body: L(
      '1. ЦЕЛЬ.\nПолучающая сторона соглашается, что вся Конфиденциальная информация, раскрытая Раскрывающей стороной, будет использоваться исключительно для: {{purpose}} («Цель»), и ни для каких иных целей.',
      '1. PURPOSE.\nThe Receiving Party agrees that all Confidential Information disclosed by the Disclosing Party shall be used solely for the purpose of {{purpose}} (the "Purpose"), and for no other reason.',
    ),
    variables: [
      { key: 'purpose', label: L('Цель раскрытия', 'Purpose of Disclosure'), type: 'longtext', required: true, placeholder: L('оценки возможного делового сотрудничества', 'evaluating a potential business relationship') },
    ],
  },
  {
    id: 'nda.confidential_info',
    title: L('Определение конфиденциальной информации', 'Definition of Confidential Information'),
    description: L('Объём того, что считается конфиденциальным.', 'Scope of what is considered confidential.'),
    body: L(
      '2. КОНФИДЕНЦИАЛЬНАЯ ИНФОРМАЦИЯ.\n«Конфиденциальная информация» означает любую непубличную информацию, раскрытую Раскрывающей стороной устно, письменно или путём демонстрации материальных объектов, включая, помимо прочего, бизнес-планы, финансовые данные, клиентские базы, технические спецификации и коммерческую тайну.',
      '2. CONFIDENTIAL INFORMATION.\n"Confidential Information" means any non-public information disclosed by the Disclosing Party, whether orally, in writing, or by inspection of tangible objects, including but not limited to business plans, financial data, customer lists, technical specifications, and trade secrets.',
    ),
    variables: [],
  },
  {
    id: 'nda.obligations',
    title: L('Обязательства получающей стороны', 'Obligations of Receiving Party'),
    description: L('Как должна обрабатываться конфиденциальная информация.', 'How confidential information must be handled.'),
    body: L(
      '3. ОБЯЗАТЕЛЬСТВА.\nПолучающая сторона обязуется: (а) сохранять Конфиденциальную информацию в строгой тайне, (б) не раскрывать её третьим лицам без предварительного письменного согласия Раскрывающей стороны, (в) принимать разумные меры для защиты её секретности — не меньшие, чем те, которые применяются к её собственной аналогичной информации.',
      '3. OBLIGATIONS.\nThe Receiving Party shall (a) hold the Confidential Information in strict confidence, (b) not disclose it to any third party without prior written consent of the Disclosing Party, and (c) take reasonable measures to protect the secrecy of the Confidential Information, no less than the measures used to protect its own confidential information of a similar nature.',
    ),
    variables: [],
  },
  {
    id: 'nda.term',
    title: L('Срок', 'Term'),
    description: L('Срок действия обязательств по конфиденциальности.', 'Duration of confidentiality obligations.'),
    body: L(
      '4. СРОК.\nОбязательства Получающей стороны по настоящему Соглашению действуют в течение {{term_years}} ({{term_years}}) лет с Даты вступления в силу.',
      '4. TERM.\nThe obligations of the Receiving Party under this Agreement shall survive for a period of {{term_years}} ({{term_years}}) years from the Effective Date.',
    ),
    variables: [
      { key: 'term_years', label: L('Срок (в годах)', 'Term (in years)'), type: 'number', required: true, placeholder: L('3', '3') },
    ],
  },
  {
    id: 'nda.mutual_clause',
    title: L('Пункт о взаимной конфиденциальности', 'Mutual Confidentiality Clause'),
    description: L('Опциональный пункт для взаимного NDA (раскрывают обе стороны).', 'Optional clause for mutual NDAs (both parties disclose).'),
    body: L(
      '4A. ВЗАИМНЫЕ ОБЯЗАТЕЛЬСТВА.\nСтороны признают, что каждая из них может раскрыть Конфиденциальную информацию другой. Соответственно, изложенные здесь обязательства применяются к обеим сторонам равно и взаимно.',
      '4A. MUTUAL OBLIGATIONS.\nBoth parties acknowledge that each may disclose Confidential Information to the other. Accordingly, the obligations set forth herein shall apply equally and reciprocally to both parties.',
    ),
    variables: [],
    condition: { variable: 'nda_type', equals: ['mutual', 'взаимное', 'взаимный'] },
  },
  {
    id: 'nda.return',
    title: L('Возврат материалов', 'Return of Materials'),
    description: L('Судьба материалов после окончания соглашения.', 'What happens to materials at the end of the agreement.'),
    body: L(
      '5. ВОЗВРАТ МАТЕРИАЛОВ.\nПо письменному требованию Получающая сторона обязана незамедлительно вернуть или уничтожить всю Конфиденциальную информацию и её копии, а также письменно подтвердить такой возврат или уничтожение.',
      '5. RETURN OF MATERIALS.\nUpon written request, the Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof, and certify in writing such return or destruction.',
    ),
    variables: [],
  },
  {
    id: 'nda.governing_law',
    title: L('Применимое право', 'Governing Law'),
    description: L('Юрисдикция, право которой регулирует соглашение.', 'Jurisdiction whose laws govern the agreement.'),
    body: L(
      '6. ПРИМЕНИМОЕ ПРАВО.\nНастоящее Соглашение регулируется и толкуется в соответствии с законодательством {{governing_law}}, без учёта коллизионных норм.',
      '6. GOVERNING LAW.\nThis Agreement shall be governed by and construed in accordance with the laws of {{governing_law}}, without regard to its conflict of laws principles.',
    ),
    variables: ndaParties,
  },
  {
    id: 'nda.signatures',
    title: L('Подписи', 'Signatures'),
    description: L('Блоки подписей обеих сторон.', 'Signature blocks for both parties.'),
    required: true,
    body: L(
      'В ПОДТВЕРЖДЕНИЕ ВЫШЕИЗЛОЖЕННОГО стороны подписали настоящее Соглашение в Дату вступления в силу.\n\nРАСКРЫВАЮЩАЯ СТОРОНА: {{disclosing_party}}\nПодпись: ________________________\nФИО: {{disclosing_signatory}}\nДолжность: {{disclosing_title}}\n\nПОЛУЧАЮЩАЯ СТОРОНА: {{receiving_party}}\nПодпись: ________________________\nФИО: {{receiving_signatory}}\nДолжность: {{receiving_title}}',
      'IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.\n\nDISCLOSING PARTY: {{disclosing_party}}\nSignature: ________________________\nName: {{disclosing_signatory}}\nTitle: {{disclosing_title}}\n\nRECEIVING PARTY: {{receiving_party}}\nSignature: ________________________\nName: {{receiving_signatory}}\nTitle: {{receiving_title}}',
    ),
    variables: [
      { key: 'disclosing_signatory', label: L('Раскрывающая сторона — ФИО подписанта', 'Disclosing Party — Signatory Name'), type: 'text', required: true },
      { key: 'disclosing_title', label: L('Раскрывающая сторона — должность', 'Disclosing Party — Signatory Title'), type: 'text', required: true, placeholder: L('Генеральный директор', 'CEO') },
      { key: 'receiving_signatory', label: L('Получающая сторона — ФИО подписанта', 'Receiving Party — Signatory Name'), type: 'text', required: true },
      { key: 'receiving_title', label: L('Получающая сторона — должность', 'Receiving Party — Signatory Title'), type: 'text', required: true, placeholder: L('Директор', 'Director') },
    ],
  },
];

// ─── Lease ────────────────────────────────────────────────────────────────────

export const leaseBlocks: LocalizedBlockDefinition[] = [
  {
    id: 'lease.header',
    title: L('Шапка и стороны', 'Header & Parties'),
    description: L('Заголовок договора аренды и стороны.', 'Lease title and parties.'),
    required: true,
    body: L(
      'ДОГОВОР АРЕНДЫ ЖИЛОГО ПОМЕЩЕНИЯ\n\nНастоящий договор аренды («Договор») заключён {{effective_date}} между {{landlord_name}} («Арендодатель») и {{tenant_name}} («Арендатор»).',
      'RESIDENTIAL LEASE AGREEMENT\n\nThis Lease Agreement (the "Lease") is made on {{effective_date}} between {{landlord_name}} ("Landlord") and {{tenant_name}} ("Tenant").',
    ),
    variables: [
      { key: 'effective_date', label: L('Дата вступления в силу', 'Effective Date'), type: 'date', required: true },
      { key: 'landlord_name', label: L('ФИО/наименование арендодателя', 'Landlord Name'), type: 'text', required: true },
      { key: 'tenant_name', label: L('ФИО/наименование арендатора', 'Tenant Name'), type: 'text', required: true },
    ],
  },
  {
    id: 'lease.premises',
    title: L('Объект', 'Premises'),
    description: L('Адрес и описание помещения.', 'Address and description of the property.'),
    required: true,
    body: L(
      '1. ОБЪЕКТ.\nАрендодатель передаёт Арендатору во временное владение и пользование жилое помещение по адресу: {{property_address}} («Объект»).',
      '1. PREMISES.\nLandlord leases to Tenant the residential premises located at {{property_address}} (the "Premises").',
    ),
    variables: [
      { key: 'property_address', label: L('Адрес объекта', 'Property Address'), type: 'longtext', required: true, placeholder: L('г. Москва, ул. Ленина, д. 1, кв. 5', '123 Main St, Apt 4B, Springfield, IL 62701') },
    ],
  },
  {
    id: 'lease.term',
    title: L('Срок аренды', 'Lease Term'),
    description: L('Даты начала и окончания аренды.', 'Start and end dates of the lease.'),
    body: L(
      '2. СРОК.\nСрок аренды начинается {{lease_start}} и заканчивается {{lease_end}}, если иное не будет предусмотрено продлением или досрочным расторжением в соответствии с настоящим Договором.',
      '2. TERM.\nThe term of this Lease shall commence on {{lease_start}} and shall terminate on {{lease_end}}, unless renewed or terminated earlier in accordance with this Lease.',
    ),
    variables: [
      { key: 'lease_start', label: L('Дата начала аренды', 'Lease Start Date'), type: 'date', required: true },
      { key: 'lease_end', label: L('Дата окончания аренды', 'Lease End Date'), type: 'date', required: true },
    ],
  },
  {
    id: 'lease.rent',
    title: L('Арендная плата', 'Rent'),
    description: L('Размер арендной платы и условия оплаты.', 'Monthly rent amount and payment terms.'),
    body: L(
      '3. АРЕНДНАЯ ПЛАТА.\nАрендатор обязуется вносить арендную плату в размере {{monthly_rent}} в месяц, не позднее {{rent_due_day}}-го числа каждого календарного месяца, на реквизиты, указанные Арендодателем письменно.',
      '3. RENT.\nTenant agrees to pay rent in the amount of {{monthly_rent}} per month, due on the {{rent_due_day}} day of each calendar month, payable to Landlord at the address specified by Landlord in writing.',
    ),
    variables: [
      { key: 'monthly_rent', label: L('Ежемесячная арендная плата', 'Monthly Rent'), type: 'currency', required: true, placeholder: L('50000', '1500') },
      { key: 'rent_due_day', label: L('День оплаты в месяце', 'Rent Due Day of Month'), type: 'number', required: true, placeholder: L('1', '1') },
    ],
  },
  {
    id: 'lease.deposit',
    title: L('Обеспечительный платёж', 'Security Deposit'),
    description: L('Размер и условия депозита.', 'Security deposit amount and conditions.'),
    body: L(
      '4. ОБЕСПЕЧИТЕЛЬНЫЙ ПЛАТЁЖ.\nПри заключении Договора Арендатор вносит Арендодателю обеспечительный платёж в размере {{deposit_amount}} в качестве обеспечения надлежащего исполнения обязательств по Договору.',
      '4. SECURITY DEPOSIT.\nUpon execution of this Lease, Tenant shall deposit with Landlord the sum of {{deposit_amount}} as security for the faithful performance by Tenant of the terms of this Lease.',
    ),
    variables: [
      { key: 'deposit_amount', label: L('Сумма депозита', 'Security Deposit Amount'), type: 'currency', required: true, placeholder: L('50000', '1500') },
    ],
  },
  {
    id: 'lease.utilities',
    title: L('Коммунальные услуги', 'Utilities'),
    description: L('Распределение ответственности за коммунальные услуги.', 'Allocates responsibility for utilities.'),
    body: L(
      '5. КОММУНАЛЬНЫЕ УСЛУГИ.\nАрендатор несёт расходы по оплате всех коммунальных услуг в отношении Объекта, за исключением следующих, которые оплачивает Арендодатель: {{landlord_utilities}}.',
      '5. UTILITIES.\nTenant shall be responsible for payment of all utilities and services to the Premises, except for the following, which shall be paid by Landlord: {{landlord_utilities}}.',
    ),
    variables: [
      { key: 'landlord_utilities', label: L('Коммунальные услуги, оплачиваемые арендодателем', 'Utilities Paid by Landlord'), type: 'text', required: false, placeholder: L('водоснабжение и вывоз мусора', 'water and trash collection') },
    ],
  },
  {
    id: 'lease.pets',
    title: L('Условие о домашних животных', 'Pets Clause'),
    description: L('Опциональный пункт, если животные разрешены.', 'Optional clause if pets are allowed.'),
    body: L(
      '6. ДОМАШНИЕ ЖИВОТНЫЕ.\nАрендатору разрешается содержать на Объекте: {{pet_description}}, при условии уплаты невозвратного платежа за животное в размере {{pet_fee}}. Арендатор несёт полную ответственность за любой ущерб, причинённый такими животными.',
      '6. PETS.\nTenant is permitted to keep {{pet_description}} on the Premises, subject to a non-refundable pet fee of {{pet_fee}}. Tenant assumes full responsibility for any damage caused by such pets.',
    ),
    variables: [
      { key: 'pet_description', label: L('Разрешённые животные', 'Permitted Pets'), type: 'text', placeholder: L('одна домашняя кошка весом до 7 кг', 'one domestic cat under 15 lbs') },
      { key: 'pet_fee', label: L('Платёж за животное', 'Pet Fee'), type: 'currency', placeholder: L('10000', '250') },
    ],
    condition: { variable: 'pets_allowed', equals: ['yes', 'да'] },
  },
  {
    id: 'lease.signatures',
    title: L('Подписи', 'Signatures'),
    description: L('Блоки подписей.', 'Signature blocks.'),
    required: true,
    body: L(
      'В ПОДТВЕРЖДЕНИЕ ВЫШЕИЗЛОЖЕННОГО стороны подписали настоящий Договор в дату, указанную в начале документа.\n\nАРЕНДОДАТЕЛЬ: {{landlord_name}}\nПодпись: ________________________\nДата: ________________________\n\nАРЕНДАТОР: {{tenant_name}}\nПодпись: ________________________\nДата: ________________________',
      'IN WITNESS WHEREOF, the parties have executed this Lease as of the date first written above.\n\nLANDLORD: {{landlord_name}}\nSignature: ________________________\nDate: ________________________\n\nTENANT: {{tenant_name}}\nSignature: ________________________\nDate: ________________________',
    ),
    variables: [],
  },
];

// ─── Offer letter ─────────────────────────────────────────────────────────────

export const offerBlocks: LocalizedBlockDefinition[] = [
  {
    id: 'offer.header',
    title: L('Шапка и приветствие', 'Header & Greeting'),
    description: L('Дата письма, получатель и приветствие.', 'Letter date, recipient, and greeting.'),
    required: true,
    body: L(
      '{{company_name}}\n{{company_address}}\n\n{{offer_date}}\n\n{{candidate_name}}\n{{candidate_address}}\n\nУважаемый(ая) {{candidate_name}},',
      '{{company_name}}\n{{company_address}}\n\n{{offer_date}}\n\n{{candidate_name}}\n{{candidate_address}}\n\nDear {{candidate_name}},',
    ),
    variables: [
      { key: 'company_name', label: L('Название компании', 'Company Name'), type: 'text', required: true },
      { key: 'company_address', label: L('Адрес компании', 'Company Address'), type: 'longtext', required: true },
      { key: 'offer_date', label: L('Дата оффера', 'Offer Date'), type: 'date', required: true },
      { key: 'candidate_name', label: L('ФИО кандидата', 'Candidate Name'), type: 'text', required: true },
      { key: 'candidate_address', label: L('Адрес кандидата', 'Candidate Address'), type: 'longtext', required: true },
    ],
  },
  {
    id: 'offer.intro',
    title: L('Предложение о работе', 'Offer Introduction'),
    description: L('Позиция и дата выхода.', 'Position offer and start date.'),
    required: true,
    body: L(
      'Мы рады предложить Вам должность {{position_title}} в компании {{company_name}} с подчинением: {{reports_to}}. Предполагаемая дата выхода — {{start_date}}.',
      'We are pleased to extend an offer of employment to you for the position of {{position_title}} at {{company_name}}, reporting to {{reports_to}}. Your anticipated start date is {{start_date}}.',
    ),
    variables: [
      { key: 'position_title', label: L('Должность', 'Position Title'), type: 'text', required: true, placeholder: L('Старший разработчик', 'Senior Software Engineer') },
      { key: 'reports_to', label: L('Руководитель', 'Reports To'), type: 'text', required: true, placeholder: L('Директор по разработке', 'Director of Engineering') },
      { key: 'start_date', label: L('Дата выхода', 'Start Date'), type: 'date', required: true },
    ],
  },
  {
    id: 'offer.compensation',
    title: L('Компенсация', 'Compensation'),
    description: L('Базовая зарплата и периодичность выплат.', 'Base salary and pay frequency.'),
    body: L(
      'КОМПЕНСАЦИЯ.\nВаш годовой оклад составит {{annual_salary}} и будет выплачиваться в соответствии со стандартной зарплатной политикой компании, с удержанием установленных законом налогов и сборов.',
      'COMPENSATION.\nYour annualized base salary will be {{annual_salary}}, payable in accordance with the Company\u2019s standard payroll practices, less applicable withholdings and deductions.',
    ),
    variables: [
      { key: 'annual_salary', label: L('Годовой оклад', 'Annual Base Salary'), type: 'currency', required: true, placeholder: L('3000000', '120000') },
    ],
  },
  {
    id: 'offer.bonus',
    title: L('Единовременный бонус', 'Signing Bonus'),
    description: L('Опциональный пункт о приветственном бонусе.', 'Optional signing bonus clause.'),
    body: L(
      'ПРИВЕТСТВЕННЫЙ БОНУС.\nВы получите единовременный бонус в размере {{signing_bonus}}, выплачиваемый в первую зарплату. Бонус подлежит полному возврату, если Вы уволитесь по собственному желанию в течение двенадцати (12) месяцев с даты выхода.',
      'SIGNING BONUS.\nYou will receive a one-time signing bonus of {{signing_bonus}}, payable in your first regular paycheck. This bonus is subject to repayment in full if you voluntarily resign within twelve (12) months of your start date.',
    ),
    variables: [
      { key: 'signing_bonus', label: L('Сумма бонуса', 'Signing Bonus Amount'), type: 'currency', required: true, placeholder: L('200000', '10000') },
    ],
    condition: { variable: 'include_bonus', equals: ['yes', 'да'] },
  },
  {
    id: 'offer.equity',
    title: L('Опционы / акции', 'Equity Grant'),
    description: L('Пункт о предоставлении акций или опционов.', 'Equity / stock options grant.'),
    body: L(
      'АКЦИИ.\nПри условии одобрения Советом директоров Вам будет предоставлено {{equity_units}} ограниченных акций (RSU) с вестингом в течение четырёх (4) лет с одногодичным клифом, в соответствии со стандартным опционным планом компании.',
      'EQUITY.\nSubject to approval by the Board of Directors, you will be granted {{equity_units}} restricted stock units, vesting over four (4) years with a one-year cliff, in accordance with the Company\u2019s standard equity plan.',
    ),
    variables: [
      { key: 'equity_units', label: L('Количество RSU', 'Number of RSUs'), type: 'number', required: true, placeholder: L('5000', '5000') },
    ],
    condition: { variable: 'include_equity', equals: ['yes', 'да'] },
  },
  {
    id: 'offer.benefits',
    title: L('Социальный пакет', 'Benefits'),
    description: L('Стандартный абзац о льготах.', 'Standard benefits paragraph.'),
    body: L(
      'ЛЬГОТЫ.\nВы сможете участвовать в стандартных программах для сотрудников компании, включая добровольное медицинское страхование, пенсионный план и {{pto_days}} дней оплачиваемого отпуска в год, в соответствии с политиками компании, которые могут время от времени изменяться.',
      'BENEFITS.\nYou will be eligible to participate in the Company\u2019s standard employee benefits programs, including health, dental, and vision insurance, retirement plan, and {{pto_days}} days of paid time off per year, in accordance with the Company\u2019s policies as they may be amended from time to time.',
    ),
    variables: [
      { key: 'pto_days', label: L('Дней отпуска в год', 'PTO Days per Year'), type: 'number', required: true, placeholder: L('28', '20') },
    ],
  },
  {
    id: 'offer.at_will',
    title: L('Порядок расторжения', 'At-Will Employment'),
    description: L('Стандартный пункт о свободном расторжении.', 'Standard at-will employment clause.'),
    body: L(
      'ПОРЯДОК РАСТОРЖЕНИЯ.\nТрудовые отношения могут быть прекращены любой из сторон в любое время с соблюдением применимого трудового законодательства; предварительное уведомление и основания расторжения определяются соответствующими нормативными актами.',
      'AT-WILL EMPLOYMENT.\nYour employment with the Company is "at-will," meaning that either you or the Company may terminate the employment relationship at any time, with or without cause and with or without notice.',
    ),
    variables: [],
  },
  {
    id: 'offer.closing',
    title: L('Заключение и подпись', 'Closing & Signature'),
    description: L('Заключительные слова и блок подписи.', 'Closing remarks and signature block.'),
    required: true,
    body: L(
      'Для принятия оффера, пожалуйста, подпишите и верните это письмо не позднее {{response_deadline}}. Мы будем рады видеть Вас в нашей команде.\n\nС уважением,\n\n{{hiring_manager_name}}\n{{hiring_manager_title}}\n{{company_name}}\n\nПРИНЯТО И СОГЛАСОВАНО:\n\n_________________________\n{{candidate_name}}\nДата: ________________________',
      'To accept this offer, please sign and return this letter by {{response_deadline}}. We are excited about the prospect of you joining our team.\n\nSincerely,\n\n{{hiring_manager_name}}\n{{hiring_manager_title}}\n{{company_name}}\n\nACCEPTED AND AGREED:\n\n_________________________\n{{candidate_name}}\nDate: ________________________',
    ),
    variables: [
      { key: 'response_deadline', label: L('Срок ответа', 'Response Deadline'), type: 'date', required: true },
      { key: 'hiring_manager_name', label: L('ФИО нанимающего менеджера', 'Hiring Manager Name'), type: 'text', required: true },
      { key: 'hiring_manager_title', label: L('Должность нанимающего менеджера', 'Hiring Manager Title'), type: 'text', required: true, placeholder: L('Руководитель HR', 'Head of People') },
    ],
  },
];

// ─── Service Agreement (new) ──────────────────────────────────────────────────

export const serviceBlocks: LocalizedBlockDefinition[] = [
  {
    id: 'service.header',
    title: L('Шапка и стороны', 'Header & Parties'),
    description: L('Название договора и стороны.', 'Title and parties.'),
    required: true,
    body: L(
      'ДОГОВОР ОКАЗАНИЯ УСЛУГ\n\nНастоящий договор («Договор») заключён {{effective_date}} между {{client_name}} («Заказчик») и {{provider_name}} («Исполнитель»).',
      'SERVICE AGREEMENT\n\nThis Service Agreement (the "Agreement") is entered into on {{effective_date}} between {{client_name}} (the "Client") and {{provider_name}} (the "Service Provider").',
    ),
    variables: [
      { key: 'effective_date', label: L('Дата договора', 'Effective Date'), type: 'date', required: true },
      { key: 'client_name', label: L('Заказчик', 'Client'), type: 'text', required: true },
      { key: 'provider_name', label: L('Исполнитель', 'Service Provider'), type: 'text', required: true },
    ],
  },
  {
    id: 'service.scope',
    title: L('Предмет договора', 'Scope of Services'),
    description: L('Перечень оказываемых услуг.', 'Description of services to be provided.'),
    required: true,
    body: L(
      '1. ПРЕДМЕТ ДОГОВОРА.\nИсполнитель обязуется оказать Заказчику следующие услуги («Услуги»):\n{{services_description}}',
      '1. SCOPE OF SERVICES.\nThe Service Provider shall provide to the Client the following services (the "Services"):\n{{services_description}}',
    ),
    variables: [
      { key: 'services_description', label: L('Описание услуг', 'Description of Services'), type: 'longtext', required: true, placeholder: L('дизайн и разработка корпоративного веб-сайта, включая все страницы и адаптив', 'design and development of a corporate website, including all pages and responsive layout') },
    ],
  },
  {
    id: 'service.term',
    title: L('Срок оказания услуг', 'Term'),
    description: L('Начало и окончание оказания услуг.', 'Service start and end dates.'),
    body: L(
      '2. СРОК.\nИсполнитель приступает к оказанию Услуг {{start_date}} и завершает их не позднее {{end_date}}, если стороны письменно не договорятся об ином.',
      '2. TERM.\nThe Service Provider shall commence the Services on {{start_date}} and complete them no later than {{end_date}}, unless the parties agree otherwise in writing.',
    ),
    variables: [
      { key: 'start_date', label: L('Дата начала', 'Start Date'), type: 'date', required: true },
      { key: 'end_date', label: L('Дата окончания', 'End Date'), type: 'date', required: true },
    ],
  },
  {
    id: 'service.fees',
    title: L('Стоимость и порядок оплаты', 'Fees & Payment'),
    description: L('Сумма вознаграждения и сроки оплаты.', 'Fee amount and payment schedule.'),
    required: true,
    body: L(
      '3. ВОЗНАГРАЖДЕНИЕ.\nЗаказчик выплачивает Исполнителю вознаграждение в размере {{total_fee}}. Оплата производится в течение {{payment_days}} календарных дней с даты подписания акта оказанных услуг.',
      '3. FEES.\nThe Client shall pay the Service Provider a total fee of {{total_fee}}. Payment shall be made within {{payment_days}} calendar days after acceptance of the Services.',
    ),
    variables: [
      { key: 'total_fee', label: L('Общая стоимость услуг', 'Total Fee'), type: 'currency', required: true, placeholder: L('500000', '10000') },
      { key: 'payment_days', label: L('Срок оплаты (дней)', 'Payment Term (days)'), type: 'number', required: true, placeholder: L('10', '15') },
    ],
  },
  {
    id: 'service.advance',
    title: L('Предоплата', 'Advance Payment'),
    description: L('Опциональный пункт о предоплате.', 'Optional clause for upfront payment.'),
    body: L(
      '3A. ПРЕДОПЛАТА.\nВ течение {{advance_days}} дней с даты подписания Договора Заказчик перечисляет Исполнителю предоплату в размере {{advance_amount}}, которая засчитывается в общую стоимость Услуг.',
      '3A. ADVANCE PAYMENT.\nWithin {{advance_days}} days of signing, the Client shall transfer an advance payment of {{advance_amount}} to the Service Provider, which shall be credited against the total fee.',
    ),
    variables: [
      { key: 'advance_amount', label: L('Сумма предоплаты', 'Advance Amount'), type: 'currency', required: true, placeholder: L('150000', '3000') },
      { key: 'advance_days', label: L('Срок внесения предоплаты (дней)', 'Advance Payment Term (days)'), type: 'number', required: true, placeholder: L('5', '5') },
    ],
    condition: { variable: 'include_advance', equals: ['yes', 'да'] },
  },
  {
    id: 'service.ip',
    title: L('Интеллектуальная собственность', 'Intellectual Property'),
    description: L('Передача прав на результаты.', 'Assignment of IP rights in deliverables.'),
    body: L(
      '4. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ.\nС момента полной оплаты Услуг исключительные права на результаты, созданные Исполнителем по настоящему Договору, переходят к Заказчику в полном объёме.',
      '4. INTELLECTUAL PROPERTY.\nUpon full payment of the fees, all exclusive rights to the work product created by the Service Provider under this Agreement shall be assigned to the Client in full.',
    ),
    variables: [],
  },
  {
    id: 'service.confidentiality',
    title: L('Конфиденциальность', 'Confidentiality'),
    description: L('Обязанность сохранять конфиденциальность.', 'Obligation of confidentiality.'),
    body: L(
      '5. КОНФИДЕНЦИАЛЬНОСТЬ.\nСтороны обязуются не разглашать конфиденциальную информацию, полученную в ходе исполнения Договора, в течение {{confidentiality_years}} лет после его прекращения.',
      '5. CONFIDENTIALITY.\nEach party agrees not to disclose confidential information obtained under this Agreement for a period of {{confidentiality_years}} years following termination.',
    ),
    variables: [
      { key: 'confidentiality_years', label: L('Срок конфиденциальности (лет)', 'Confidentiality Period (years)'), type: 'number', required: true, placeholder: L('3', '3') },
    ],
  },
  {
    id: 'service.signatures',
    title: L('Подписи', 'Signatures'),
    description: L('Блоки подписей сторон.', 'Signature blocks.'),
    required: true,
    body: L(
      'Стороны подтверждают своё согласие с условиями настоящего Договора:\n\nЗАКАЗЧИК: {{client_name}}\nПодпись: ________________________\nДата: ________________________\n\nИСПОЛНИТЕЛЬ: {{provider_name}}\nПодпись: ________________________\nДата: ________________________',
      'The parties confirm their agreement to the terms of this Agreement:\n\nCLIENT: {{client_name}}\nSignature: ________________________\nDate: ________________________\n\nSERVICE PROVIDER: {{provider_name}}\nSignature: ________________________\nDate: ________________________',
    ),
    variables: [],
  },
];

// ─── Freelance Contract (new) ─────────────────────────────────────────────────

export const freelanceBlocks: LocalizedBlockDefinition[] = [
  {
    id: 'freelance.header',
    title: L('Шапка и стороны', 'Header & Parties'),
    description: L('Название документа и стороны.', 'Document title and parties.'),
    required: true,
    body: L(
      'ДОГОВОР С ФРИЛАНСЕРОМ\n\nНастоящий договор заключён {{effective_date}} между {{client_name}} («Заказчик») и {{freelancer_name}} («Фрилансер») на выполнение работ, описанных ниже.',
      'FREELANCE CONTRACT\n\nThis Freelance Contract is made on {{effective_date}} between {{client_name}} ("Client") and {{freelancer_name}} ("Freelancer") for the work described below.',
    ),
    variables: [
      { key: 'effective_date', label: L('Дата договора', 'Effective Date'), type: 'date', required: true },
      { key: 'client_name', label: L('Заказчик', 'Client'), type: 'text', required: true },
      { key: 'freelancer_name', label: L('Фрилансер', 'Freelancer'), type: 'text', required: true },
      { key: 'freelancer_email', label: L('Email фрилансера', 'Freelancer Email'), type: 'email', required: true },
    ],
  },
  {
    id: 'freelance.project',
    title: L('Описание проекта', 'Project Description'),
    description: L('Объём и результат работ.', 'Scope of work and deliverables.'),
    required: true,
    body: L(
      '1. ПРОЕКТ.\nФрилансер выполняет следующую работу: {{project_description}}\n\nИтоговые результаты: {{deliverables}}',
      '1. PROJECT.\nThe Freelancer will perform the following work: {{project_description}}\n\nDeliverables: {{deliverables}}',
    ),
    variables: [
      { key: 'project_description', label: L('Описание проекта', 'Project Description'), type: 'longtext', required: true, placeholder: L('разработка логотипа и фирменного стиля', 'logo design and brand identity') },
      { key: 'deliverables', label: L('Результаты', 'Deliverables'), type: 'longtext', required: true, placeholder: L('исходники в формате .ai и .svg, брендбук в PDF', 'source files in .ai and .svg, brand guidelines PDF') },
    ],
  },
  {
    id: 'freelance.rate',
    title: L('Ставка и оплата', 'Rate & Payment'),
    description: L('Почасовая ставка или фиксированная сумма.', 'Hourly rate or fixed fee.'),
    required: true,
    body: L(
      '2. ОПЛАТА.\nТип оплаты: {{rate_type}}. Ставка/сумма: {{rate_amount}}. Итоговые счета направляются Заказчику по email {{client_email}} и подлежат оплате в течение {{payment_days}} календарных дней с даты выставления.',
      '2. PAYMENT.\nPayment type: {{rate_type}}. Rate/amount: {{rate_amount}}. Invoices shall be sent to the Client at {{client_email}} and are due within {{payment_days}} calendar days of issuance.',
    ),
    variables: [
      { key: 'rate_type', label: L('Тип оплаты', 'Rate Type'), type: 'text', required: true, placeholder: L('почасовая / фиксированная', 'hourly / fixed') },
      { key: 'rate_amount', label: L('Сумма или ставка', 'Amount or Rate'), type: 'currency', required: true, placeholder: L('3000', '75') },
      { key: 'client_email', label: L('Email заказчика', 'Client Email'), type: 'email', required: true },
      { key: 'payment_days', label: L('Срок оплаты счёта (дней)', 'Invoice Due (days)'), type: 'number', required: true, placeholder: L('14', '14') },
    ],
  },
  {
    id: 'freelance.revisions',
    title: L('Правки', 'Revisions'),
    description: L('Количество включённых раундов правок.', 'Number of included revision rounds.'),
    body: L(
      '3. ПРАВКИ.\nВ стоимость входит {{revision_rounds}} раундов правок. Последующие правки оплачиваются отдельно по согласованной ставке.',
      '3. REVISIONS.\nThe fee includes {{revision_rounds}} rounds of revisions. Additional revisions will be billed separately at the agreed rate.',
    ),
    variables: [
      { key: 'revision_rounds', label: L('Количество раундов правок', 'Revision Rounds'), type: 'number', required: true, placeholder: L('2', '2') },
    ],
  },
  {
    id: 'freelance.ip',
    title: L('Права на результаты', 'IP & Ownership'),
    description: L('Передача прав после оплаты.', 'Transfer of rights upon payment.'),
    body: L(
      '4. ПРАВА.\nВсе исключительные права на результаты переходят Заказчику после полной оплаты. До этого момента права сохраняются за Фрилансером.',
      '4. OWNERSHIP.\nAll intellectual property rights in the deliverables transfer to the Client upon full payment. Until then, rights remain with the Freelancer.',
    ),
    variables: [],
  },
  {
    id: 'freelance.termination',
    title: L('Расторжение', 'Termination'),
    description: L('Порядок досрочного расторжения.', 'How the contract can be terminated.'),
    body: L(
      '5. РАСТОРЖЕНИЕ.\nЛюбая из сторон может расторгнуть настоящий договор, направив письменное уведомление не менее чем за {{notice_days}} дней. В случае расторжения Заказчик оплачивает все фактически выполненные работы.',
      '5. TERMINATION.\nEither party may terminate this contract with at least {{notice_days}} days\' written notice. Upon termination, the Client shall pay for all work completed up to the termination date.',
    ),
    variables: [
      { key: 'notice_days', label: L('Срок уведомления (дней)', 'Notice Period (days)'), type: 'number', required: true, placeholder: L('7', '7') },
    ],
  },
  {
    id: 'freelance.signatures',
    title: L('Подписи', 'Signatures'),
    description: L('Подписи сторон.', 'Signature blocks.'),
    required: true,
    body: L(
      'ЗАКАЗЧИК: {{client_name}}\nПодпись: ________________________\nДата: ________________________\n\nФРИЛАНСЕР: {{freelancer_name}}\nПодпись: ________________________\nДата: ________________________',
      'CLIENT: {{client_name}}\nSignature: ________________________\nDate: ________________________\n\nFREELANCER: {{freelancer_name}}\nSignature: ________________________\nDate: ________________________',
    ),
    variables: [],
  },
];

// ─── Invoice (new) ────────────────────────────────────────────────────────────

export const invoiceBlocks: LocalizedBlockDefinition[] = [
  {
    id: 'invoice.header',
    title: L('Шапка счёта', 'Invoice Header'),
    description: L('Номер счёта и дата.', 'Invoice number and date.'),
    required: true,
    body: L(
      'СЧЁТ НА ОПЛАТУ № {{invoice_number}}\nДата выставления: {{invoice_date}}\nСрок оплаты: {{due_date}}',
      'INVOICE #{{invoice_number}}\nIssue date: {{invoice_date}}\nDue date: {{due_date}}',
    ),
    variables: [
      { key: 'invoice_number', label: L('Номер счёта', 'Invoice Number'), type: 'text', required: true, placeholder: L('2026-001', '2026-001') },
      { key: 'invoice_date', label: L('Дата выставления', 'Issue Date'), type: 'date', required: true },
      { key: 'due_date', label: L('Срок оплаты', 'Due Date'), type: 'date', required: true },
    ],
  },
  {
    id: 'invoice.from',
    title: L('От кого', 'From'),
    description: L('Реквизиты получателя платежа.', 'Payee details.'),
    required: true,
    body: L(
      'ОТ:\n{{from_name}}\n{{from_address}}\nИНН/Налоговый номер: {{from_tax_id}}\nEmail: {{from_email}}',
      'FROM:\n{{from_name}}\n{{from_address}}\nTax ID: {{from_tax_id}}\nEmail: {{from_email}}',
    ),
    variables: [
      { key: 'from_name', label: L('Наименование / ФИО', 'Name / Business'), type: 'text', required: true },
      { key: 'from_address', label: L('Адрес', 'Address'), type: 'longtext', required: true },
      { key: 'from_tax_id', label: L('ИНН / налоговый номер', 'Tax ID'), type: 'text', required: true },
      { key: 'from_email', label: L('Email', 'Email'), type: 'email', required: true },
    ],
  },
  {
    id: 'invoice.to',
    title: L('Кому', 'Bill To'),
    description: L('Реквизиты плательщика.', 'Client billing details.'),
    required: true,
    body: L(
      'КОМУ:\n{{to_name}}\n{{to_address}}\nИНН/Налоговый номер: {{to_tax_id}}',
      'BILL TO:\n{{to_name}}\n{{to_address}}\nTax ID: {{to_tax_id}}',
    ),
    variables: [
      { key: 'to_name', label: L('Наименование клиента', 'Client Name'), type: 'text', required: true },
      { key: 'to_address', label: L('Адрес клиента', 'Client Address'), type: 'longtext', required: true },
      { key: 'to_tax_id', label: L('ИНН клиента', 'Client Tax ID'), type: 'text', required: false },
    ],
  },
  {
    id: 'invoice.items',
    title: L('Услуги и товары', 'Line Items'),
    description: L('Перечень услуг или товаров.', 'Description of billed items.'),
    required: true,
    body: L(
      'НАИМЕНОВАНИЕ И ОПИСАНИЕ:\n{{items_description}}\n\nИтого к оплате: {{subtotal}}',
      'ITEMS:\n{{items_description}}\n\nSubtotal: {{subtotal}}',
    ),
    variables: [
      { key: 'items_description', label: L('Описание услуг/товаров', 'Items Description'), type: 'longtext', required: true, placeholder: L('Услуги по разработке — 40 часов × 3000 ₽ = 120 000 ₽', 'Development services — 40 hours × $75 = $3,000') },
      { key: 'subtotal', label: L('Сумма без налога', 'Subtotal'), type: 'currency', required: true, placeholder: L('120000', '3000') },
    ],
  },
  {
    id: 'invoice.tax',
    title: L('Налог', 'Tax'),
    description: L('Опциональная строка налога.', 'Optional tax line.'),
    body: L(
      'НАЛОГ ({{tax_rate}}%): {{tax_amount}}',
      'TAX ({{tax_rate}}%): {{tax_amount}}',
    ),
    variables: [
      { key: 'tax_rate', label: L('Ставка налога, %', 'Tax Rate, %'), type: 'number', required: true, placeholder: L('20', '8') },
      { key: 'tax_amount', label: L('Сумма налога', 'Tax Amount'), type: 'currency', required: true, placeholder: L('24000', '240') },
    ],
    condition: { variable: 'include_tax', equals: ['yes', 'да'] },
  },
  {
    id: 'invoice.total',
    title: L('Итого', 'Total'),
    description: L('Итоговая сумма к оплате.', 'Final amount due.'),
    required: true,
    body: L(
      'ИТОГО К ОПЛАТЕ: {{total_amount}}',
      'TOTAL DUE: {{total_amount}}',
    ),
    variables: [
      { key: 'total_amount', label: L('Итоговая сумма', 'Total Amount'), type: 'currency', required: true, placeholder: L('144000', '3240') },
    ],
  },
  {
    id: 'invoice.payment',
    title: L('Платёжные реквизиты', 'Payment Details'),
    description: L('Реквизиты для перевода.', 'Bank / payment details.'),
    required: true,
    body: L(
      'РЕКВИЗИТЫ ДЛЯ ОПЛАТЫ:\n{{payment_details}}\n\nПри оплате, пожалуйста, укажите номер счёта {{invoice_number}} в назначении платежа.',
      'PAYMENT DETAILS:\n{{payment_details}}\n\nPlease reference invoice #{{invoice_number}} on your payment.',
    ),
    variables: [
      { key: 'payment_details', label: L('Реквизиты', 'Bank / Payment Details'), type: 'longtext', required: true, placeholder: L('Банк: Тинькофф\nр/с: 40702810000000000000\nБИК: 044525974', 'Bank: Chase\nAccount: 000123456\nRouting: 021000021') },
    ],
  },
  {
    id: 'invoice.notes',
    title: L('Примечания', 'Notes'),
    description: L('Дополнительные условия и благодарность.', 'Additional notes and thanks.'),
    body: L(
      'ПРИМЕЧАНИЯ:\n{{notes}}\n\nСпасибо за сотрудничество!',
      'NOTES:\n{{notes}}\n\nThank you for your business!',
    ),
    variables: [
      { key: 'notes', label: L('Примечания', 'Notes'), type: 'longtext', required: false, placeholder: L('Оплата в течение 14 дней. Просроченные платежи облагаются пеней 0,1% в день.', 'Payment due within 14 days. Late payments subject to 1.5% monthly interest.') },
    ],
  },
];
