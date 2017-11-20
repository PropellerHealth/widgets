if (typeof window === "undefined") {
  global.window = {};
}

if (typeof document === "undefined") {
  global.document = {};
}

function checkStatus(response) {
  // console.log(response);
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function extractJSON(response) {
  return response.json();
}

const headers = {
  "Content-Type": "application/json"
};

const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

const API_HEADER = {
  "Content-Type": "application/x-www-form-urlencoded"
};

// liberated from DTC
const checkResponse = response => response.ok ? response : Promise.reject(response);

const specialties = [
  {
    "uid": "sport-physical-therapist",
    "name": "Sports Physical Therapy",
    "description": "Specializes in sport injury related physical therapy.",
    "category": "medical",
    "actor": "Sports Physical Therapist",
    "actors": "Sports Physical Therapists"
  },
  {
    "uid": "sports-vision-optometrist",
    "name": "Sports Vision",
    "description": "Specializes in sport related eye injuries and treatments.",
    "category": "vision",
    "actor": "Sports Vision Optometrist",
    "actors": "Sports Vision Optometrists"
  },
  {
    "uid": "surgery-hospice-and-palliative-medicine",
    "name": "Surgery Hospice and Palliative Medicine",
    "description": "A surgeon with special knowledge and skills to prevent and relieve the suffering experienced by patients with life-limiting illnesses. This specialist works with an interdisciplinary hospice or palliative care team to maximize quality of life while addressing physical, psychological, social and spiritual needs of both patient and family throughout the course of the disease, through the dying process, and beyond for the family.  This specialist has expertise in the assessment of patients with advanced disease; the relief of distressing symptoms; the coordination of interdisciplinary patient and family-centered care in diverse venues; the use of specialized care systems including hospice; the management of the imminently dying patient; and legal and ethical decision making in end-of-life care.",
    "category": "medical",
    "actor": "Surgery Hospice and Palliative Medicine",
    "actors": "Surgery Hospice and Palliative Medicines"
  },
  {
    "uid": "sleep-medicine-doctor",
    "name": "Sleep Medicine",
    "description": "Specializes in  sleep disorders.",
    "category": "medical",
    "actor": "Sleep Medicine Doctor",
    "actors": "Sleep Medicine Doctors"
  },
  {
    "uid": "therapeutic-radiologist",
    "name": "Therapeutic Radiology",
    "description": "Specializes in the treatment of cancer and other diseases with radiation.",
    "category": "medical",
    "actor": "Therapeutic Radiologist",
    "actors": "Therapeutic Radiologists"
  },
  {
    "uid": "speech-therapist",
    "name": "Speech Therapy",
    "description": "Specializes in speech therapy.",
    "category": "medical",
    "actor": "Speech Therapist",
    "actors": "Speech Therapists"
  },
  {
    "uid": "spinal-cord-injury-physiatrist",
    "name": "Spinal Cord Injury Medicine",
    "description": "Specializes in patients with spinal cord injuries.",
    "category": "medical",
    "actor": "Spinal Cord Injury Physiatrist",
    "actors": "Spinal Cord Injury Physiatrists"
  },
  {
    "uid": "legal-medicine",
    "name": "Legal Medicine",
    "description": "Legal Medicine is a special field of medicine that focuses on various aspects of medicine and law. Historically, the practice of legal medicine made contributions to medicine as a scientific instrument to solve criminal perplexities. Since World War II, the domain of legal medicine has broadened to include not only aspects of medical science to solve legal and criminal problems but aspects of law as it applies to medicine. Legal Medicine continues to grow as medicolegal issues like medical malpractice and liability, government regulation of health care, issues of tort reform, and moral and ethical complexities presented by technological advances become increasingly prominent. Many medical schools have implemented courses which supply medicolegal instruction for medical students, and many law schools now offer medicolegal courses. Also, dual degree programs in law and medicine have been created to assist physicians to bridge the gap between medicine and the law.",
    "category": "medical",
    "actor": "Legal Medicine",
    "actors": "Legal Medicines"
  },
  {
    "uid": "medical-examiner-chiropractor",
    "name": "Chiropractic Medical Examiner",
    "description": "Specializes in alternartive therapy of muscles, bones, and joints.",
    "category": "medical",
    "actor": "Medical Examiner Chiropractor",
    "actors": "Medical Examiner Chiropractors"
  },
  {
    "uid": "mental-health-nurse-practitioner",
    "name": "Psych/Mental Health Nurse Practitioner",
    "description": "Specializes in mental health.",
    "category": "medical",
    "actor": "Mental Health Nurse Practitoner",
    "actors": "Mental Health Nurse Practitoners"
  },
  {
    "uid": "micrographic-surgeon",
    "name": "MOHS-Micrographic Surgery",
    "description": "Specializes in removing diseased skin via surgical methods.",
    "category": "medical",
    "actor": "Micrographic Surgeon",
    "actors": "Micrographic Surgeons"
  },
  {
    "uid": "neuropathologist",
    "name": "Neuropathology",
    "description": "Specializes in diagnosing nervous system diseases.",
    "category": "medical",
    "actor": "Neuropathologist",
    "actors": "Neuropathologists"
  },
  {
    "uid": "nuclear-cardiologist",
    "name": "Nuclear Cardiology",
    "description": "Specializes in diagnosing and treating diseases with radioactive materials.",
    "category": "medical",
    "actor": "Nuclear Cardiologist",
    "actors": "Nuclear Cardiologists"
  },
  {
    "uid": "nuclear-imaging-doctor",
    "name": "Nuclear Imaging & Therapy",
    "description": "Specializes in diagnosing and treating diseases with radioactive materials.",
    "category": "medical",
    "actor": "Nuclear Imaging & Therapy Doctor",
    "actors": "Nuclear Imaging & Therapy Doctors"
  },
  {
    "uid": "occupational-medicine-doctor",
    "name": "Occupational Medicine",
    "description": "Specializes in occupational preventive care.",
    "category": "medical",
    "actor": "Occupational Medicine Doctor",
    "actors": "Occupational Medicine Doctors"
  },
  {
    "uid": "body-imaging-radiologist",
    "name": "Body Imaging",
    "description": "Specializes in body imaging.",
    "category": "medical",
    "actor": "Body Imaging Radiologist",
    "actors": "Body Imaging Radiologists"
  },
  {
    "uid": "critical-care-obgyn",
    "name": "Critical Care Medicine OBGYN",
    "description": "Specializes in critical care diagnoses and treatment.",
    "category": "medical",
    "actor": "Critical Care OBGYN",
    "actors": "Critical Care OBGYNS"
  },
  {
    "uid": "dental-laboratory-technician",
    "name": "Dental Laboratory Technician",
    "description": "An individual who has the skill and knowledge in the fabrication of dental appliances, prostheses and devices in accordance with a dentist's laboratory work authorization.  To avoid misleading the public, no occupational title other than dental laboratory technician or certified dental technician (when appropriate) should be used to describe this auxiliary.",
    "category": "dental",
    "actor": "Dental Laboratory Technician",
    "actors": "Dental Laboratory Technicians"
  },
  {
    "uid": "dental-therapist",
    "name": "Dental Therapist",
    "description": "A Dental Therapist is an individual who has completed an accredited or non-accredited dental therapy program and who has been authorized by the relevant state board or a tribal entity to provide services within the scope of their practice under the supervision of a dentist. Functions that may be delegated to the dental therapist vary based on the needs of the dentist, the educational preparation of the dental therapist and state dental practice acts and regulations.",
    "category": "dental",
    "actor": "Dental Therapist",
    "actors": "Dental Therapists"
  },
  {
    "uid": "dentist",
    "name": "Dentistry",
    "description": "Specializes in teeth and oral health.",
    "category": "dental",
    "actor": "Dentist",
    "actors": "Dentists"
  },
  {
    "uid": "clinical-pathologist",
    "name": "Clinical Pathology",
    "description": "Specializes in laboratory tests of tissue and bodily fluids.",
    "category": "medical",
    "actor": "Clinical Pathologist",
    "actors": "Clinical Pathologists"
  },
  {
    "uid": "allergy-immunology-allergy",
    "name": "Allergy & Immunology Allergy",
    "description": "Definition to come...",
    "category": "medical",
    "actor": "Allergist",
    "actors": "Allergists"
  },
  {
    "uid": "group-psychotherapy-psychologist",
    "name": "Group Psychotherapy",
    "description": "Specializes in counceling and therapy in groups.",
    "category": "medical",
    "actor": "Group Psychotherapy Psychologist",
    "actors": "Group Psychotherapy Psychologists"
  },
  {
    "uid": "internal-medicine-clinical-laboratory-immunology",
    "name": "Internal Medicine Clinical & Laboratory Immunology",
    "description": "An internal medicine physician who specializes in clinical and laboratory immunology disease management.",
    "category": "medical",
    "actor": "Internal Medicine Clinical & Laboratory Immunology",
    "actors": "Internal Medicine Clinical & Laboratory Immunologies"
  },
  {
    "uid": "immunodermatologist",
    "name": "Clinical & Laboratory Dermatological Immunology",
    "description": "Specializes in diagnoses of the body's immune system by laboratory procedures.",
    "category": "medical",
    "actor": "Immunodermatologist",
    "actors": "Immunodermatologists"
  },
  {
    "uid": "dermatologist",
    "name": "Dermatology",
    "description": "Specializes in skin disorders, including moles and melanoma.",
    "category": "medical",
    "actor": "Dermatologist",
    "actors": "Dermatologists"
  },
  {
    "uid": "dermatopathology-doctor",
    "name": "Dermatopathology",
    "description": "Specializes in laboratory tests of skin.",
    "category": "medical",
    "actor": "Dermatopathologist",
    "actors": "Dermatopathologists"
  },
  {
    "uid": "occupational-therapy-assistant",
    "name": "Occupational Therapy Assistant",
    "description": "An occupational therapy assistant is a person who has graduated from an occupational therapy assistant program accredited by the Accreditation Council for Occupational Therapy Education (ACOTE) or predecessor organizations, has successfully completed a period of supervised fieldwork experience required by the accredited occupational therapy assistant program, has passed a nationally recognized entry-level examination for occupational therapy assistants, and fulfills state requirements for licensure, certification, or registration.  An occupational therapy assistant provides interventions under the supervision of an occupational therapist which emphasize the therapeutic use of everyday life activities (i.e., occupations) with individuals or groups for the purpose of facilitating participation in roles and situations and in home, school, workplace, community and other settings.  Occupational therapy services are provided for the purpose of promoting health and wellness and are provided to those who have or are at risk for developing an illness, injury, disease, disorder, condition, impairment, disability, activity limitation, or participation restriction.  Occupational therapy assistants address the physical, cognitive, psychosocial, sensory, and other aspects of occupational performance in a variety of contexts to support engagement in everyday life activities that affect health, well-being, and quality of life.",
    "category": "therapy",
    "actor": "Occupational Therapy Assistant",
    "actors": "Occupational Therapy Assistants"
  },
  {
    "uid": "occupational-therapy-assistant-feeding-eating-swallowing",
    "name": "Occupational Therapy Assistant Feeding, Eating & Swallowing",
    "description": "Occupational therapy assistants provide environmental modifications under the supervision of an occupational therapist.  OTAs develop and implement an individualized occupational therapy environmental modification plan that reflects the relevant contexts of the client and relevant others and maximizes current and future occupational performance, safety, and participation of the client. Clients receive environmental modification recommendations and interventions that enable them to meet occupational performance and participation goals and that have adequate flexibility to accommodate for their future needs.",
    "category": "therapy",
    "actor": "Occupational Therapy Assistant Feeding, Eating & Swallowing",
    "actors": "Occupational Therapy Assistant Feeding, Eating & Swallowings"
  },
  {
    "uid": "occupational-therapy-assistant-low-vision",
    "name": "Occupational Therapy Assistant Low Vision",
    "description": "Occupational therapy assistants contribute to the completion of an individualized occupational therapy low-vision evaluation under the direction and supervision of the occupational therapist to identify factors that may facilitate, compensate for, or inhibit use of vision in occupational performance.  Clients are engaged in the identification of strengths, limitations, and goals as they relate to low vision to optimize independence and participation in desired occupations.  Occupational therapy assistants also contribute to the development and implementation of an individualized occupational therapy low-vision intervention plan in collaboration with the occupational therapist, client, and relevant others that reflects the client's priorities for occupational performance.",
    "category": "therapy",
    "actor": "Occupational Therapy Assistant Low Vision",
    "actors": "Occupational Therapy Assistant Low Visions"
  },
  {
    "uid": "occupational-therapy-assistant-driving-and-community-mobility",
    "name": "Occupational Therapy Assistant Driving and Community Mobility",
    "description": "Occupational therapy assistants contribute to the completion of an individualized occupational therapy driving and community mobility evaluation by administering delegated assessments and identifying findings that impact the client's occupational performance. Clients engage in the assessment and occupational profile process to customize the evaluation to their individual driving and community mobility needs.  Occupational therapy assistants administer and continuously modify individualized in-vehicle and community mobility assessments within the naturalistic context of the community in response to the occupational performance and safety behaviors of the client.  They also implement an individualized intervention plan, within the parameters established in collaboration with the occupational therapist that reflects the contexts of the client and meets his or her occupational performance and safety needs.  Occupational therapy assistants address immediate and long-term implications of psychosocial issues related to compromised driving and community mobility throughout the occupational therapy process and makes recommendations to the occupational therapist for modification to service delivery.",
    "category": "therapy",
    "actor": "Occupational Therapy Assistant Driving and Community Mobility",
    "actors": "Occupational Therapy Assistant Driving and Community Mobilities"
  },
  {
    "uid": "urologist",
    "name": "Urology",
    "description": "Specializes in genital and urinary problems.",
    "category": "medical",
    "actor": "Urologist",
    "actors": "Urologists"
  },
  {
    "uid": "vision-therapy-optometrist",
    "name": "Vision Therapy",
    "description": "Specializes in therapies to help improve vision.",
    "category": "vision",
    "actor": "Vision Therapist",
    "actors": "Vision Therapists"
  },
  {
    "uid": "oral-pathologist",
    "name": "Oral and Maxillofacial Pathology",
    "description": "Specializes in identification of oral diseases.",
    "category": "dental",
    "actor": "Oral Pathologist",
    "actors": "Oral Pathologists"
  },
  {
    "uid": "oral-surgeon",
    "name": "Oral & Maxillofacial Surgery",
    "description": "Specializes in surgical operations of the mouth, jaw and face.",
    "category": "medical",
    "actor": "Oral Surgeon",
    "actors": "Oral Surgeons"
  },
  {
    "uid": "pain-management-doctor",
    "name": "Pain Medicine",
    "description": "Specializes in pain management and prevention.",
    "category": "medical",
    "actor": "Pain Management Doctor",
    "actors": "Pain Management Doctors"
  },
  {
    "uid": "pediatric-chiropractor",
    "name": "Chiropractic Pediatrics",
    "description": "Specializes in alternartive therapy of muscles, bones, and joints.",
    "category": "medical",
    "actor": "Pediatric Chiropractor",
    "actors": "Pediatric Chiropractors"
  },
  {
    "uid": "pediatric-physical-therapist",
    "name": "Pediatric Physical Therapy",
    "description": "Specializes in children's physical therapy.",
    "category": "medical",
    "actor": "Pediatrics Physical Therapist",
    "actors": "Pediatrics Physical Therapists"
  },
  {
    "uid": "pediatric-rheumatologist",
    "name": "Pediatric Rheumatology",
    "description": "Specializes in children's joints, muscles, bones and tendons.",
    "category": "medical",
    "actor": "Pediatric Rheumatologist",
    "actors": "Pediatric Rheumatologists"
  },
  {
    "uid": "pediatric-pulmonologist",
    "name": "Pediatric Pulmonology",
    "description": "Specializes in children's lungs and airways.",
    "category": "medical",
    "actor": "Pediatric Pulmonologist",
    "actors": "Pediatric Pulmonologists"
  },
  {
    "uid": "pediatric-dermatologist",
    "name": "Pediatric Dermatology",
    "description": "Specializes in children's skin disorders, including moles and melanoma.",
    "category": "medical",
    "actor": "Pediatric Dermatologist",
    "actors": "Pediatric Dermatologists"
  },
  {
    "uid": "blood-banking-transfusion-doctor",
    "name": "Blood Banking & Transfusion Medicine",
    "description": "Specializes in blood transfusion and banking.",
    "category": "medical",
    "actor": "Blood Banking & Transfusion Doctor",
    "actors": "Blood Banking & Transfusion Doctors"
  },
  {
    "uid": "ear-nose-throat-doctor",
    "name": "Otolaryngology",
    "description": "Specializes in ear, nose and throat problems.",
    "category": "medical",
    "actor": "Ear, Nose and Throat Doctor",
    "actors": "Ear, Nose and Throat Doctors"
  },
  {
    "uid": "facial-plastic-surgeon",
    "name": "Facial Plastic Surgery",
    "description": "Specializes in facial, plastic and reconstructive surgery.",
    "category": "medical",
    "actor": "Facial Plastic Surgeon",
    "actors": "Facial Plastic Surgeons"
  },
  {
    "uid": "medical-microbiologist",
    "name": "Medical Microbiology",
    "description": "Specializes in viruses and bacteria that cause diseases.",
    "category": "medical",
    "actor": "Medical Microbiologist",
    "actors": "Medical Microbiologists"
  },
  {
    "uid": "family-medicine-hospice-and-palliative-medicine",
    "name": "Family Medicine Hospice and Palliative Medicine",
    "description": "A family medicine physician with special knowledge and skills to prevent and relieve the suffering experienced by patients with life-limiting illnesses. This specialist works with an interdisciplinary hospice or palliative care team to maximize quality of life while addressing physical, psychological, social and spiritual needs of both patient and family throughout the course of the disease, through the dying process, and beyond for the family.  This specialist has expertise in the assessment of patients with advanced disease; the relief of distressing symptoms; the coordination of interdisciplinary patient and family-centered care in diverse venues; the use of specialized care systems including hospice; the management of the imminently dying patient; and legal and ethical decision making in end-of-life care.",
    "category": "medical",
    "actor": "Family Medicine Hospice and Palliative Medicine",
    "actors": "Family Medicine Hospice and Palliative Medicines"
  },
  {
    "uid": "low-vision-rehabilitation-optometrist",
    "name": "Low Vision Rehabilitation",
    "description": "Specializes in treating patients with very poor vision.",
    "category": "vision",
    "actor": "Low Vision Rehabilitation Optometrist",
    "actors": "Low Vision Rehabilitation Optometrists"
  },
  {
    "uid": "family-medicine-sleep-medicine",
    "name": "Family Medicine Sleep Medicine",
    "description": "A Family Medicine Physician who practices Sleep Medicine is certified in the subspecialty of sleep medicine and specializes in the clinical assessment, physiologic testing, diagnosis, management and prevention of sleep and circadian rhythm disorders. Sleep specialists treat patients of any age and use multidisciplinary approaches. Disorders managed by sleep specialists include, but are not limited to, sleep related breathing disorders, insomnia, hypersomnias, circadian rhythm sleep disorders, parasomnias and sleep related movement disorders.",
    "category": "medical",
    "actor": "Family Medicine Sleep Medicine",
    "actors": "Family Medicine Sleep Medicines"
  },
  {
    "uid": "pediatric-radiologist",
    "name": "Pediatric Radiology",
    "description": "Specializes in imaging of children via X-rays and ultrasound.",
    "category": "medical",
    "actor": "Pediatric Radiologist",
    "actors": "Pediatric Radiologists"
  },
  {
    "uid": "rehabilitation-chiropractor",
    "name": "Chiropractic Rehabilitation",
    "description": "Specializes in alternartive therapy of muscles, bones, and joints.",
    "category": "medical",
    "actor": "Rehabilitation Chiropractor",
    "actors": "Rehabilitation Chiropractors"
  },
  {
    "uid": "radiology-podiatrist",
    "name": "Radiology Podiatry",
    "description": "Specializes in foot and ankle imaging.",
    "category": "medical",
    "actor": "Radiology Podiatrist",
    "actors": "Radiology Podiatrists"
  },
  {
    "uid": "psychiatry-neurology-forensic-psychiatry",
    "name": "Psychiatry & Neurology Forensic Psychiatry",
    "description": "Forensic Psychiatry is a subspecialty with psychiatric focus on interrelationships with civil, criminal and administrative law, evaluation and specialized treatment of individuals involved with the legal system, incarcerated in jails, prisons, and forensic psychiatry hospitals.",
    "category": "medical",
    "actor": "Psychiatry & Neurology Forensic Psychiatry",
    "actors": "Psychiatry & Neurology Forensic Psychiatries"
  },
  {
    "uid": "pulmonary-function-technologist",
    "name": "Pulmonary Function Technologist",
    "description": "An individual who is trained and qualified to perform pulmonary diagnostic tests.  In the course of conducting these tests, the Pulmonary Function Technologist is able to setup, calibrate, maintain, and ensure the quality assurance of the pulmonary function testing equipment.  In the laboratory, clinical or patient care setting the technologist instructs patients, elicits cooperation, performs procedures, monitors patient response, and evaluates patient performance.  Tests results are calculated, compared with predicted normal ranges, and evaluated for reliability.  The technologist collects clinical history data and evaluates the clinical implications of the test results.",
    "category": "services",
    "actor": "Pulmonary Function Technologist",
    "actors": "Pulmonary Function Technologists"
  },
  {
    "uid": "primary-care-nurse-practitioner",
    "name": "Primary Care Nurse Practitioner",
    "description": "Specializes in your and your family's health.",
    "category": "medical",
    "actor": "Primary Care Nurse Practitoner",
    "actors": "Primary Care Nurse Practitoners"
  },
  {
    "uid": "professional-counselor",
    "name": "Professional Counseling",
    "description": "Specializes in professional counseling counseling.",
    "category": "medical",
    "actor": "Professional Counselor",
    "actors": "Professional Counselors"
  },
  {
    "uid": "psychiatrist",
    "name": "Psychiatry",
    "description": "Specializes in the diagnosis and treatment of mental disorders.",
    "category": "medical",
    "actor": "Psychiatrist",
    "actors": "Psychiatrists"
  },
  {
    "uid": "psychiatry-neurology-addiction-medicine",
    "name": "Psychiatry & Neurology Addiction Medicine",
    "description": "A doctor of osteopathy board eligible/certified in the field of Psychiatry by the American Osteopathic Board of Neurology and Psychiatry is able to obtain a Certificate of Added Qualifications in the field of Addiction Medicine",
    "category": "medical",
    "actor": "Psychiatry & Neurology Addiction Medicine",
    "actors": "Psychiatry & Neurology Addiction Medicines"
  },
  {
    "uid": "phlebology",
    "name": "Phlebology",
    "description": "Phlebology is the medical discipline that involves the diagnosis and treatment of venous disorders, including spider veins, varicose veins, chronic venous insufficiency, venous leg ulcers, congenital venous abnormalities, venous thromboembolism and other disorders of venous origin.   A phlebologist has attained a minimum of 50 hours of CME units in phlebology-related courses, and is knowledgeable of and trained in a variety of diagnostic techniques including physical examination, venous imaging techniques such as duplex ultrasound, CT and MR, plethysmographic techniques and laboratory evaluation related to venous thromboembolism.  The phlebologist is also trained in a variety of therapeutic interventions, which may include compression, sclerotherapy, cutaneous vascular laser, endovenous thermoablation procedures (laser and radiofrequency) endovenous chemical ablation, surgical procedures (e.g., ambulatory phlebectomy, venous ligation), vasoactive medications and the management of venous thromboembolism.",
    "category": "medical",
    "actor": "Phlebologist",
    "actors": "Phlebologists"
  },
  {
    "uid": "physiatrist",
    "name": "Physical Medicine & Rehabilitation",
    "description": "Specializes in treating patients with physical disabilities.",
    "category": "medical",
    "actor": "Physiatrist",
    "actors": "Physiatrists"
  },
  {
    "uid": "pedorthist",
    "name": "Pedorthist",
    "description": "An individual who is trained in the management and treatment of conditions of the foot, ankle, and lower extremities requiring fitting, fabricating, and adjusting of pedorthic devices.",
    "category": "services",
    "actor": "pedorthist",
    "actors": "pedorthists"
  },
  {
    "uid": "plastic-surgery-plastic-surgery-within-the-head-and-neck",
    "name": "Plastic Surgery Plastic Surgery Within the Head and Neck",
    "description": "A plastic surgeon with additional training in plastic and reconstructive procedures within the head, face, neck and associated structures, including cutaneous head and neck oncology and reconstruction, management of maxillofacial trauma, soft tissue repair and neural surgery. The field is diverse and involves a wide age range of patients, from the newborn to the aged. While both cosmetic and reconstructive surgery is practiced, there are many additional procedures which interface with them.",
    "category": "medical",
    "actor": "Plastic Surgery Plastic Surgery Within the Head and Neck",
    "actors": "Plastic Surgery Plastic Surgery Within the Head and Necks"
  },
  {
    "uid": "plastic-surgery-specialist",
    "name": "Plastic Surgery",
    "description": "Specializes in plastic and reconstructive surgery.",
    "category": "medical",
    "actor": "Plastic Surgeon",
    "actors": "Plastic Surgeons"
  },
  {
    "uid": "physical-therapist",
    "name": "Physical Therapy",
    "description": "Specializes in physical therapy.",
    "category": "medical",
    "actor": "Physical Therapist",
    "actors": "Physical Therapists"
  },
  {
    "uid": "podiatry-foot-surgeon",
    "name": "Foot Surgery",
    "description": "Specializes in foot surgery.",
    "category": "medical",
    "actor": "Podiatric Foot Surgeon",
    "actors": "Podiatric Foot Surgeons"
  },
  {
    "uid": "rehabilitation-counselor",
    "name": "Rehabilitation Counselor",
    "description": "An individual trained and educated in a systematic process of assisting persons with physical, mental, developmental, cognitive, and emotional disabilities to achieve their personal, career, and independent living goals assessment and appraisal, diagnosis and treatment planning, career (vocational) counseling, individual and group counseling interventions for adjustments to the medical and psychosocial impact of disability, case management, program evaluation and research, job analysis and placement counseling, and consultation on rehabilitation resources and technology. Certification generally requires a Master's degree with specialized courses in rehabilitation processes and technology.",
    "category": "therapy",
    "actor": "Rehabilitation Counselor",
    "actors": "Rehabilitation Counselors"
  },
  {
    "uid": "respiratory-therapist-certified-pulmonary-diagnostics",
    "name": "Respiratory Therapist, Certified Pulmonary Diagnostics",
    "description": "Included in the area of pulmonary diagnostics are the following; collection and analysis of physiological specimens, interpretation of physiological data, administration of tests of the cardiopulmonary system, and the conduct of both neurophysiological and sleep disorders studies.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified Pulmonary Diagnostic",
    "actors": "Respiratory Therapist, Certified Pulmonary Diagnostics"
  },
  {
    "uid": "rehabilitation-psychologist",
    "name": "Rehabilitation Psychology",
    "description": "Specializes in rehabilitation counceling and therapy.",
    "category": "medical",
    "actor": "Rehabilitation Psychologist",
    "actors": "Rehabilitation Psychologists"
  },
  {
    "uid": "respiratory-therapist-registered-pulmonary-diagnostics",
    "name": "Respiratory Therapist, Registered Pulmonary Diagnostics",
    "description": "Included in the area of pulmonary diagnostics are the following; collection and analysis of physiological specimens, interpretation of physiological data, administration of tests of the cardiopulmonary system, and the conduct of both neurophysiological and sleep disorders studies.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered Pulmonary Diagnostic",
    "actors": "Respiratory Therapist, Registered Pulmonary Diagnostics"
  },
  {
    "uid": "respiratory-therapist-registered-snfsubacute-care",
    "name": "Respiratory Therapist, Registered SNF/Subacute Care",
    "description": "Care of residents in a long-term care environment.  Respiratory modalities delivered include those similar in the general care and critical care areas but provided to less critical patients.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered SNF/Subacute Care",
    "actors": "Respiratory Therapist, Registered SNF/Subacute Cares"
  },
  {
    "uid": "rheumatologist",
    "name": "Rheumatology",
    "description": "Specializes in joints, muscles, bones and tendons.",
    "category": "medical",
    "actor": "Rheumatologist",
    "actors": "Rheumatologists"
  },
  {
    "uid": "radiology-chiropractor",
    "name": "Chiropractic Radiology",
    "description": "Specializes in alternartive therapy of muscles, bones, and joints.",
    "category": "medical",
    "actor": "Radiology Chiropractor",
    "actors": "Radiology Chiropractors"
  },
  {
    "uid": "reconstructive-orthopedist",
    "name": "Adult Reconstructive orthopedic Surgery",
    "description": "Specializes in reconstructive surgery, including hip and knee.",
    "category": "medical",
    "actor": "Reconstructive Surgeon",
    "actors": "Reconstructive Surgeons"
  },
  {
    "uid": "respiratory-therapist-certified-general-care",
    "name": "Respiratory Therapist, Certified General Care",
    "description": "This level of care includes diagnostics testing, therapeutics, monitoring, rehabilitation of patients with disorders of the cardiopulmonary system, as well as, education of the patient and family in regard to those disorders.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified General Care",
    "actors": "Respiratory Therapist, Certified General Cares"
  },
  {
    "uid": "respiratory-therapist-certified-educational",
    "name": "Respiratory Therapist, Certified Educational",
    "description": "The focus of patient and family education activities is to promote knowledge of disease process, medical therapy, and self help.  Respiratory therapists are uniquely qualified to provide this service in regard to cardiopulmonary diseases and injury.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified Educational",
    "actors": "Respiratory Therapist, Certified Educationals"
  },
  {
    "uid": "respiratory-therapist-certified-geriatric-care",
    "name": "Respiratory Therapist, Certified Geriatric Care",
    "description": "Care of older patients who have age and/or disease related decremental pulmonary changes.  Diagnosis and treatment is very important for this group since chronic lung disease is the major cause of morbidity and mortality among them.  Furthermore, as this segment of the population increases, life expectancy is being extended.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified Geriatric Care",
    "actors": "Respiratory Therapist, Certified Geriatric Cares"
  },
  {
    "uid": "respiratory-therapist-certified",
    "name": "Respiratory Therapist, Certified",
    "description": "A Certified Respiratory Therapist (CRT) is a an entry level therapist who has passed a standardized written examination administered by the National Board for Respiratory Care (NBRC).  CRTs provide diagnostic testing, therapeutics, monitoring, rehabilitation, and education to patients with disorders of the cardiopulmonary system.  They provide these respiratory care services in all health care facilities and in the home.  A CRT is a graduate of an associate degree program approved by the Commission on Accreditation of Allied Health Educational Programs (CAAHEP) and where applicable, is licensed by the state and is practicing within the scope of the license.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified",
    "actors": "Respiratory Therapist, Certifieds"
  },
  {
    "uid": "preventive-medical-toxicologist",
    "name": "Preventive Medical Toxicology",
    "description": "Specializes in preventing illnesses related to drugs and chemicals.",
    "category": "medical",
    "actor": "Preventive Medical Toxicologist",
    "actors": "Preventive Medical Toxicologists"
  },
  {
    "uid": "primary-podiatry-doctor",
    "name": "Primary Podiatric Medicine",
    "description": "Specializes in foot and ankle problems.",
    "category": "medical",
    "actor": "Podiatrist",
    "actors": "Podiatrists"
  },
  {
    "uid": "procedural-dermatologist",
    "name": "Procedural Dermatology",
    "description": "Specializes in skin related surgical operations.",
    "category": "medical",
    "actor": "Procedural Dermatologist",
    "actors": "Procedural Dermatologists"
  },
  {
    "uid": "psychiatry-neurology-behavioral-neurology-neuropsychiatry",
    "name": "Psychiatry & Neurology Behavioral Neurology & Neuropsychiatry",
    "description": "Behavioral Neurology & Neuropsychiatry is a medical subspecialty involving the diagnosis and treatment of neurologically based behavioral issues.",
    "category": "medical",
    "actor": "Psychiatry & Neurology Behavioral Neurology & Neuropsychiatry",
    "actors": "Psychiatry & Neurology Behavioral Neurology & Neuropsychiatries"
  },
  {
    "uid": "psychiatry-neurology-diagnostic-neuroimaging",
    "name": "Psychiatry & Neurology Diagnostic Neuroimaging",
    "description": "A licensed physician, who has completed a residency program in Neurology, and who has additional training, experience, and competence in the standards of performance and interpretation of Magnetic Resonance Imaging (MRI / MRA) of the head, spine, and peripheral nerves, and Computed Tomography (CT) of the head and spine. Physicians are trained in the administration of contrast media and the recognition and treatment of adverse reactions to contrast media. Neuroimaging training encompasses thorough knowledge of clinical neurology, neurophysiology, neuroanatomy, neurochemistry, neuropharmacology, and dynamics of cerebrospinal fluid circulation.  Physicians possess special expertise in the technical aspects and clinical applications of each of the modalities and techniques of neuroimaging.",
    "category": "medical",
    "actor": "Psychiatry & Neurology Diagnostic Neuroimaging",
    "actors": "Psychiatry & Neurology Diagnostic Neuroimagings"
  },
  {
    "uid": "psychiatry-neurology-psychosomatic-medicine",
    "name": "Psychiatry & Neurology Psychosomatic Medicine",
    "description": "Psychosomatic Medicine is subspecialty in the diagnosis and treatment of psychiatric disorders and symptoms in complex medically ill patients. This subspecialty includes treatment of patients with acute or chronic medical, neurological, obstetrical or surgical illness in which psychiatric illness is affecting their medical care and/or quality of life such as HIV infection, organ transplantation, heart disease, renal failure, cancer, stroke, traumatic brain injury, high-risk pregnancy and COPD, among others. Patients also may be those who have a psychiatric disorder that is the direct consequence of a primary medical condition, or a somatoform disorder or psychological factors affecting a general medical condition. Psychiatrists specializing in Psychosomatic Medicine provide consultation-liaison services in general medical hospitals, attend on medical psychiatry inpatient units, and provide collaborative care in primary care and other outpatient settings.",
    "category": "medical",
    "actor": "Psychiatry & Neurology Psychosomatic Medicine",
    "actors": "Psychiatry & Neurology Psychosomatic Medicines"
  },
  {
    "uid": "respiratory-therapist-certified-critical-care",
    "name": "Respiratory Therapist, Certified Critical Care",
    "description": "Respiratory emergencies are commonplace in the treatment of critical care patients.  Included in the assessment measurements conducted by the respiratory therapist in the critical care settings are arterial blood gas puncture and analysis, intrarterial monitoring, bedside measurements of lung mechanics, hemodynamic monitoring, and inspired and expired gas measurements.  This is coupled with the initiation and management of mechanical ventilation patients.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified Critical Care",
    "actors": "Respiratory Therapist, Certified Critical Cares"
  },
  {
    "uid": "sports-medicine-orthopedist",
    "name": "Orthopedic Sports Medicine",
    "description": "Specializes in surgery and treatment of sport related injuries.",
    "category": "medical",
    "actor": "Sports Medicine Orthopedist",
    "actors": "Sports Medicine Orthopedists"
  },
  {
    "uid": "respiratory-therapist-certified-snfsubacute-care",
    "name": "Respiratory Therapist, Certified SNF/Subacute Care",
    "description": "Care of residents in a long-term care environment.  Respiratory modalities delivered include those similar in the general care and critical care areas but provided to less critical patients.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified SNF/Subacute Care",
    "actors": "Respiratory Therapist, Certified SNF/Subacute Cares"
  },
  {
    "uid": "respiratory-therapist-registered-critical-care",
    "name": "Respiratory Therapist, Registered Critical Care",
    "description": "Respiratory emergencies are commonplace in the treatment of critical care patients.  Included in the assessment measurements conducted by the respiratory therapist in the critical care settings are arterial blood gas puncture and analysis, intrarterial monitoring, bedside measurements of lung mechanics, hemodynamic monitoring, and inspired and expired gas measurements.  This is coupled with the initiation and management of mechanical ventilation patients.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered Critical Care",
    "actors": "Respiratory Therapist, Registered Critical Cares"
  },
  {
    "uid": "school-counselor",
    "name": "School Counseling",
    "description": "Specializes in school counseling.",
    "category": "medical",
    "actor": "School Counselor",
    "actors": "School Counselors"
  },
  {
    "uid": "techniciantechnologist-ocularist",
    "name": "Technician/Technologist Ocularist",
    "description": "Definition to come...",
    "category": "vision",
    "actor": "Technician/Technologist Ocularist",
    "actors": "Technician/Technologist Ocularists"
  },
  {
    "uid": "acupuncturist",
    "name": "Acupuncture",
    "description": "Specializes in ancient alternative therapy via needles.",
    "category": "medical",
    "actor": "Acupuncturist",
    "actors": "Acupuncturists"
  },
  {
    "uid": "acute-nurse-practitioner",
    "name": "Acute Care Nurse Practitioner",
    "description": "Specializes in immediate care.",
    "category": "medical",
    "actor": "Acute Nurse Practitoner",
    "actors": "Acute Nurse Practitoners"
  },
  {
    "uid": "addiction-psychiatrist",
    "name": "Addiction Psychiatry",
    "description": "Specializes in alcohol, drug and substance problems.",
    "category": "medical",
    "actor": "Addiction Psychiatrist",
    "actors": "Addiction Psychiatrists"
  },
  {
    "uid": "clinical-psychologist",
    "name": "Clinical Psychology",
    "description": "Specializes in psychological counceling and therapy.",
    "category": "medical",
    "actor": "Clinical Psychologist",
    "actors": "Clinical Psychologists"
  },
  {
    "uid": "anaplastologist",
    "name": "Anaplastologist",
    "description": "An anaplastologist is a professional who creates prostheses for the face and body.  Patients treated include those missing anatomy due to cancer, traumatic injury, or birth differences.  Generally, there are no state licensing requirements for anaplastologists.  Certification specific to anaplastology is provided through the Board for Certified Clinical Anaplastology (BCCA) with a credential title of Certified Clinical Anaplastologist (CCA).",
    "category": "services",
    "actor": "Anaplastologist",
    "actors": "Anaplastologists"
  },
  {
    "uid": "aerospace-medicine-doctor",
    "name": "Aerospace Medicine",
    "description": "Specializes in health and safety of airplane crewmembers and passangers.",
    "category": "medical",
    "actor": "Aerospace Medicine Doctor",
    "actors": "Aerospace Medicine Doctors"
  },
  {
    "uid": "anesthesiologist",
    "name": "Anesthesiology",
    "description": "Specializes in managing pain and anesthesia in surgeries.",
    "category": "medical",
    "actor": "Anesthesiologist",
    "actors": "Anesthesiologists"
  },
  {
    "uid": "cardiopulmonary-physical-therapist",
    "name": "Cardiopulmonary Physical Therapy",
    "description": "Specializes in heart and lung related physical therapy.",
    "category": "medical",
    "actor": "Cardiopulmonary Physical Therapist",
    "actors": "Cardiopulmonary Physical Therapists"
  },
  {
    "uid": "health-service-psychologist",
    "name": "Health Service Psychology",
    "description": "Specializes in patients whose functioning is impaired.",
    "category": "medical",
    "actor": "Health Service Psychologist",
    "actors": "Health Service Psychologists"
  },
  {
    "uid": "developmental-therapist",
    "name": "Developmental Therapist",
    "description": "A Developmental Therapist is a person qualified by completion of an approved program in Developmental Therapy and where applicable credentialed by the state and practicing within the scope of the credential, or credentialed by completion of education experiences as approved by the state and practicing within the scope of that credential or, where state credentialing does not exist, certified by the Board of the Developmental Therapy Association. A developmental therapist evaluates children's global development in order to identify areas of developmental delay whether arising from physiological, neurological, or environmental factors, or a combination of factors; and designs, implements, and modifies therapeutic interventions for the child and the family to promote the child's acquisition of skills in a variety of developmental areas, including cognitive processes and social interaction in order to maximize functional independence and developmental homeostasis, and improve the quality of life at home and in the community; and provides consultation for the parents and other professionals working with the family on global development.",
    "category": "therapy",
    "actor": "Developmental Therapist",
    "actors": "Developmental Therapists"
  },
  {
    "uid": "developmental-behavioral-pediatrician",
    "name": "Developmental Behavioral Pediatrics",
    "description": "Specializes in developmental difficulties and problematic behaviors in children.",
    "category": "medical",
    "actor": "Developmental Behavioral Pediatrician",
    "actors": "Developmental Behavioral Pediatricians"
  },
  {
    "uid": "forensic-psychologist",
    "name": "Forensic Psychology",
    "description": "Specializes in psychology related criminal matters.",
    "category": "medical",
    "actor": "Forensic Psychologist",
    "actors": "Forensic Psychologists"
  },
  {
    "uid": "geriatric-psychiatrist",
    "name": "Geriatric Psychiatry",
    "description": "Specializes in the diagnosis and treatment of mental disorders in the elderly.",
    "category": "medical",
    "actor": "Geriatric Psychiatrist",
    "actors": "Geriatric Psychiatrists"
  },
  {
    "uid": "clinical-pharmacology",
    "name": "Clinical Pharmacology",
    "description": "Clinical pharmacology encompasses the spectrum of activities related to the discovery, development, regulation, and utilization of safe and effective drugs.",
    "category": "medical",
    "actor": "Clinical Pharmacology",
    "actors": "Clinical Pharmacologies"
  },
  {
    "uid": "critical-care-doctor",
    "name": "Critical Care Medicine",
    "description": "Specializes in the care of critically ill patients.",
    "category": "medical",
    "actor": "Critical Care Doctor",
    "actors": "Critical Care Doctors"
  },
  {
    "uid": "hearing-aid-audiologist",
    "name": "Audiology & Hearing Aid Fitter",
    "description": "Specializes in hearing and hearing aids.",
    "category": "medical",
    "actor": "Hearing Aid Audiologist",
    "actors": "Hearing Aid Audiologists"
  },
  {
    "uid": "hospice-care-palliative-doctor",
    "name": "Hospice and Palliative Medicine",
    "description": "Specializes in preventing and relieving suffering of dying patients.",
    "category": "medical",
    "actor": "Hospice Care and Palliative Doctor",
    "actors": "Hospice Care and Palliative Doctors"
  },
  {
    "uid": "independent-medical-examiner",
    "name": "Independent Medical Examiner",
    "description": "A special evaluator not involved with the medical care of the individual examinee that impartially evaluates the care being provided by other practitioners to clarify clinical, disability, liability or other case issues.",
    "category": "services",
    "actor": "Independent Medical Examiner",
    "actors": "Independent Medical Examiners"
  },
  {
    "uid": "internal-medicine-adolescent-medicine",
    "name": "Internal Medicine Adolescent Medicine",
    "description": "An internist who specializes in adolescent medicine is a multi-disciplinary healthcare specialist trained in the unique physical, psychological and social characteristics of adolescents, their healthcare problems and needs.",
    "category": "medical",
    "actor": "Internal Medicine Adolescent Medicine",
    "actors": "Internal Medicine Adolescent Medicines"
  },
  {
    "uid": "internal-medicine-bariatric-medicine",
    "name": "Internal Medicine Bariatric Medicine",
    "description": "Bariatric medicine is the medical treatment of obesity and its associated conditions.  Bariatric medicine addresses the obese individual with a comprehensive program of diet, exercise and behavior modification, and when indicated, the prescription of appropriate medications as determined by the Bariatric physician.  Bariatric physicians are licensed physicians who offer specialized programs in the medical treatment of obesity and its associated conditions. ",
    "category": "medical",
    "actor": "Internal Medicine Bariatric Medicine",
    "actors": "Internal Medicine Bariatric Medicines"
  },
  {
    "uid": "internal-medicine-sports-medicine",
    "name": "Internal Medicine Sports Medicine",
    "description": "An internist trained to be responsible for continuous care in the field of sports medicine, not only for the enhancement of health and fitness, but also for the prevention of injury and illness. A sports medicine physician must have knowledge and experience in the promotion of wellness and the prevention of injury. Knowledge about special areas of medicine such as exercise physiology, biomechanics, nutrition, psychology, physical rehabilitation, epidemiology, physical evaluation, injuries (treatment and prevention and referral practice) and the role of exercise in promoting a healthy lifestyle are essential to the practice of sports medicine. The sports medicine physician requires special education to provide the knowledge to improve the healthcare of the individual.",
    "category": "medical",
    "actor": "Internal Medicine Sports Medicine",
    "actors": "Internal Medicine Sports Medicines"
  },
  {
    "uid": "internist",
    "name": "Internal Medicine",
    "description": "Specializes in common illnesses and complex medical problems.",
    "category": "medical",
    "actor": "Internist",
    "actors": "Internists"
  },
  {
    "uid": "laboratory-medicine-doctor",
    "name": "Clinical Pathology/Laboratory Medicine",
    "description": "Specializes in laboratory tests of tissue and bodily fluids.",
    "category": "medical",
    "actor": "Clinical Pathologist",
    "actors": "Clinical Pathologists"
  },
  {
    "uid": "interventional-cardiologist",
    "name": "Interventional Cardiology",
    "description": "Specializes in heart imaging and diagnostics.",
    "category": "medical",
    "actor": "Interventional Cardiologist",
    "actors": "Interventional Cardiologists"
  },
  {
    "uid": "medical-genetics-molecular-genetic-pathology",
    "name": "Medical Genetics Molecular Genetic Pathology",
    "description": "A board certified subspecialty, the molecular genetic pathologist is expert in the principles, theory and technologies of molecular biology and molecular genetics. This expertise is used to make or confirm diagnoses of Mendelian genetic disorders, of human development, infectious diseases and malignancies and to assess the natural history of those disorders. A molecular genetic pathologist provides information about gene structure, function and alteration, and applies laboratory techniques for diagnosis, treatment and prognosis for individuals with related disorders.",
    "category": "medical",
    "actor": "Medical Genetics Molecular Genetic Pathology",
    "actors": "Medical Genetics Molecular Genetic Pathologies"
  },
  {
    "uid": "nutritionist",
    "name": "Nutrition Medicine",
    "description": "Specializes in alternative food and nutrition therapies.",
    "category": "medical",
    "actor": "Nutritionist",
    "actors": "Nutritionists"
  },
  {
    "uid": "obstetrics-gynecology-female-pelvic-medicine-and-reconstructive-surgery",
    "name": "Obstetrics & Gynecology Female Pelvic Medicine and Reconstructive Surgery",
    "description": "A subspecialist in Female Pelvic Medicine and Reconstructive Surgery is a physician in Urology or Obstetrics and Gynecology who, by virtue of education and training, is prepared to provide consultation and comprehensive management of women with complex benign pelvic conditions, lower urinary tract disorders, and pelvic floor dysfunction. Comprehensive management includes those diagnostic and therapeutic procedures necessary for the total care of the patient with these conditions and complications resulting from them.",
    "category": "medical",
    "actor": "Obstetrics & Gynecology Female Pelvic Medicine and Reconstructive Surgery",
    "actors": "Obstetrics & Gynecology Female Pelvic Medicine and Reconstructive Surgeries"
  },
  {
    "uid": "obstetrics-gynecologist",
    "name": "Obstetrics & Gynecology",
    "description": "Specializes in the care of the female reproductive system.",
    "category": "medical",
    "actor": "OBGYN",
    "actors": "OBGYNS"
  },
  {
    "uid": "occupational-therapist",
    "name": "Occupational Therapist",
    "description": "An occupational therapist is a person who has graduated from an entry-level occupational therapy program accredited by the Accreditation Council for Occupational Therapy Education (ACOTE) or predecessor organizations, or approved by the World Federation of Occupational Therapists (WFOT), or an equivalent international occupational therapy education program; has successfully completed a period of supervised fieldwork experience required by the occupational therapy program; has passed a nationally recognized entry-level examination for occupational therapists, and fulfills state requirements for licensure, certification, or registration. An occupational therapist provides interventions based on evaluation and which emphasize the therapeutic use of everyday life activities (i.e., occupations) with individuals or groups for the purpose of facilitating participation in roles and situations and in home, school, workplace, community and other settings. Occupational therapy services are provided for the purpose of promoting health and wellness and are provided to those who have or are at risk for developing an illness, injury, disease, disorder, condition, impairment, disability, activity limitation, or participation restriction.  Occupational therapists address the physical, cognitive, psychosocial, sensory, and other aspects of occupational performance in a variety of contexts to support engagement in everyday life activities that affect health, well-being, and quality of life.",
    "category": "therapy",
    "actor": "Occupational Therapist",
    "actors": "Occupational Therapists"
  },
  {
    "uid": "music-therapist",
    "name": "Music Therapist",
    "description": "Music therapists use music interventions to assess clients' strengths and needs, develop goals, implement services, and evaluate and document progress for individuals of all ages.  Music therapists facilitate changes in physical, cognitive, emotional, and/or psychosocial health.",
    "category": "therapy",
    "actor": "Music Therapist",
    "actors": "Music Therapists"
  },
  {
    "uid": "neuromusculoskeletal-medicine-doctor",
    "name": "Neuromusculoskeletal Medicine & OMM",
    "description": "Specializes in holistic physical therapy to treat illnesses.",
    "category": "medical",
    "actor": "Neuromusculoskeletal Medicine Doctor",
    "actors": "Neuromusculoskeletal Medicine Doctors"
  },
  {
    "uid": "neonatal-critical-care-nurse-practitioner",
    "name": "Neonatal, Critical Care Nurse Practitioner",
    "description": "Specializes in premature and ill new borns as well as high-risk pregnancies.",
    "category": "medical",
    "actor": "Neonatal Nurse Practitoner",
    "actors": "Neonatal Nurse Practitoners"
  },
  {
    "uid": "neurosurgeon",
    "name": "Neurological Surgery",
    "description": "Specializes in nervous system and brain surgery.",
    "category": "medical",
    "actor": "Neurosurgeon",
    "actors": "Neurosurgeons"
  },
  {
    "uid": "nuclear-medicine-doctor",
    "name": "Nuclear Medicine",
    "description": "Specializes in diagnosing and treating diseases with radioactive materials.",
    "category": "medical",
    "actor": "Nuclear Medicine Doctor",
    "actors": "Nuclear Medicine Doctors"
  },
  {
    "uid": "occupational-therapist-ergonomics",
    "name": "Occupational Therapist Ergonomics",
    "description": "Definition to come...",
    "category": "therapy",
    "actor": "Occupational Therapist Ergonomic",
    "actors": "Occupational Therapist Ergonomics"
  },
  {
    "uid": "occupational-therapist-environmental-modification",
    "name": "Occupational Therapist Environmental Modification",
    "description": "Occupational therapy practitioners are experts at identifying the cause of difficulties in performance of activities of daily living and instrumental activities of daily living.  Occupational therapy practitioners evaluate the client, their environment, and their occupational performance in that environment, as well as make recommendations for products to improve the fit between the client, place, and activity.  Occupational therapists can evaluate both the skills of the client and the environmental features that support or limit the performance of meaningful or necessary activities, thereby enhancing health, safety and well-being.  Based on this assessment, they recommend modification and intervention strategies that improve the fit between the person and his or her environment.",
    "category": "therapy",
    "actor": "Occupational Therapist Environmental Modification",
    "actors": "Occupational Therapist Environmental Modifications"
  },
  {
    "uid": "orthopedic-chiropractor",
    "name": "Chiropractic Orthopedics",
    "description": "Specializes in alternartive therapy of muscles, bones, and joints.",
    "category": "medical",
    "actor": "Orthopedic Chiropractor",
    "actors": "Orthopedic Chiropractors"
  },
  {
    "uid": "otology-neurotologist",
    "name": "Otology & Neurotology",
    "description": "Specializes in ear and hearing problems.",
    "category": "medical",
    "actor": "Otology Neurotologist",
    "actors": "Otology Neurotologists"
  },
  {
    "uid": "ophthalmologist",
    "name": "Ophthalmology",
    "description": "Specializes in vision, eye care, and eye surgery including Lasik.",
    "category": "vision",
    "actor": "Ophthalmologist",
    "actors": "Ophthalmologists"
  },
  {
    "uid": "oncologist",
    "name": "Hematology & Oncology",
    "description": "Specializes in the diagnosis and treatment of cancer and tumors.",
    "category": "medical",
    "actor": "Oncologist",
    "actors": "Oncologists"
  },
  {
    "uid": "diagnostic-ultrasound-radiologist",
    "name": "Diagnostic Ultrasound",
    "description": "Specializes in diagnostic ultrasound.",
    "category": "medical",
    "actor": "Diagnostic Ultrasound Radiologist",
    "actors": "Diagnostic Ultrasound Radiologists"
  },
  {
    "uid": "cardiothoracic-surgeon",
    "name": "Cardiothoracic Surgery",
    "description": "Specializes in chest and heart surgery.",
    "category": "medical",
    "actor": "Cardiothoracic Surgeon",
    "actors": "Cardiothoracic Surgeons"
  },
  {
    "uid": "emergency-medicine-hospice-and-palliative-medicine",
    "name": "Emergency Medicine Hospice and Palliative Medicine",
    "description": "An emergency medicine physician with special knowledge and skills to prevent and relieve the suffering experienced by patients with life-limiting illnesses. This specialist works with an interdisciplinary hospice or palliative care team to maximize quality of life while addressing physical, psychological, social and spiritual needs of both patient and family throughout the course of the disease, through the dying process, and beyond for the family.  This specialist has expertise in the assessment of patients with advanced disease; the relief of distressing symptoms; the coordination of interdisciplinary patient and family-centered care in diverse venues; the use of specialized care systems including hospice; the management of the imminently dying patient; and legal and ethical decision making in end-of-life care.",
    "category": "medical",
    "actor": "Emergency Medicine Physician",
    "actors": "Emergency Medicine Physicians"
  },
  {
    "uid": "pediatric-cardiologist",
    "name": "Pediatric Cardiology",
    "description": "Specializes in children with heart problems.",
    "category": "medical",
    "actor": "Pediatric Cardiologist",
    "actors": "Pediatric Cardiologists"
  },
  {
    "uid": "environmental-preventive-medicine-doctor",
    "name": "Environmental Preventive Medicine",
    "description": "Specializes in environmental related preventive care.",
    "category": "medical",
    "actor": "Environmental Preventive Medicine Doctor",
    "actors": "Environmental Preventive Medicine Doctors"
  },
  {
    "uid": "dietitian",
    "name": "Dietitian, Registered",
    "description": "Specializes in alternative food and nutrition therapies.",
    "category": "medical",
    "actor": "Dietitian",
    "actors": "Dietitians"
  },
  {
    "uid": "mental-health-counselor",
    "name": "Mental Health Counseling",
    "description": "Specializes in mental health service counseling.",
    "category": "medical",
    "actor": "Mental Health Counselor",
    "actors": "Mental Health Counselors"
  },
  {
    "uid": "nephrologist",
    "name": "Nephrology",
    "description": "Specializes in patients with kidney disorders.",
    "category": "medical",
    "actor": "Nephrologist",
    "actors": "Nephrologists"
  },
  {
    "uid": "emergency-medicine-pediatrician",
    "name": "Pediatric Emergency Medicine",
    "description": "Specializes in immediate decisions and actions related to children's health.",
    "category": "medical",
    "actor": "Emergency Pediatrician",
    "actors": "Emergency Pediatricians"
  },
  {
    "uid": "preventive-medicine-doctor",
    "name": "Preventive Medicine",
    "description": "Specializes in preventive care and public health.",
    "category": "medical",
    "actor": "Preventive Medicine Doctor",
    "actors": "Preventive Medicine Doctors"
  },
  {
    "uid": "podiatrist",
    "name": "Podiatry",
    "description": "Specializes in foot and ankle problems.",
    "category": "medical",
    "actor": "Podiatrist",
    "actors": "Podiatrists"
  },
  {
    "uid": "pediatric-gastroenterologist",
    "name": "Pediatric Gastroenterology",
    "description": "Specializes in children's digestive system.",
    "category": "medical",
    "actor": "Pediatric Gastroenterologist",
    "actors": "Pediatric Gastroenterologists"
  },
  {
    "uid": "pediatric-nurse-practitioner",
    "name": "Pediatric Nurse Practitioner",
    "description": "Specializes in the health of children from birth to young adulthood.",
    "category": "medical",
    "actor": "Pediatric Nurse Practitoner",
    "actors": "Pediatric Nurse Practitoners"
  },
  {
    "uid": "otolaryngology-facial-plastic-surgeon",
    "name": "Otolaryngology/Facial Plastic Surgery",
    "description": "Specializes in facial, plastic and reconstructive surgery.",
    "category": "medical",
    "actor": "Facial Plastic Surgeon",
    "actors": "Facial Plastic Surgeons"
  },
  {
    "uid": "orthotist",
    "name": "Orthotist",
    "description": "A health care professional who is specifically educated and trained to manage comprehensive orthotic patient care, including musculoskeletal and neuromuscular anomalies resulting from injuries or disease processes involving the lower extremity, upper extremity or spinal segment/s and positional deformation of the cranium. Orthotists assess specific patient needs, formulate an appropriate treatment plan, implement the treatment plan and provide follow-up care.",
    "category": "services",
    "actor": "Orthotist",
    "actors": "Orthotists"
  },
  {
    "uid": "pastoral-counselor",
    "name": "Pastoral Counseling",
    "description": "Specializes in behavioral health service counseling.",
    "category": "medical",
    "actor": "Pastoral Counselor",
    "actors": "Pastoral Counselors"
  },
  {
    "uid": "pediatrician",
    "name": "Pediatrics",
    "description": "Specializes in the health of children from birth to young adulthood.",
    "category": "medical",
    "actor": "Pediatrician",
    "actors": "Pediatricians"
  },
  {
    "uid": "pediatric-optometrist",
    "name": "Pediatric Optometry",
    "description": "Specializes in children's eye and visual problems.",
    "category": "vision",
    "actor": "Pediatric Optometrist",
    "actors": "Pediatric Optometrists"
  },
  {
    "uid": "pediatric-medical-toxicologist",
    "name": "Medical Toxicology",
    "description": "Specializes in injury and illness from exposures to drugs and chemicals ",
    "category": "medical",
    "actor": "Medical Toxicologist",
    "actors": "Medical Toxicologists"
  },
  {
    "uid": "addiction-medicine-anesthesiologist",
    "name": "Addiction Medicine",
    "description": "Specializes in the diagnosis and treatment of addictions.",
    "category": "medical",
    "actor": "Addiction Medicine Anesthesiologist",
    "actors": "Addiction Medicine Anesthesiologists"
  },
  {
    "uid": "allergy-immunology-clinical-laboratory-immunology",
    "name": "Allergy & Immunology Clinical & Laboratory Immunology",
    "description": "Definition to come...",
    "category": "medical",
    "actor": "Allergy & Immunology Clinical & Laboratory Immunology",
    "actors": "Allergy & Immunology Clinical & Laboratory Immunologies"
  },
  {
    "uid": "adolescent-medicine-pediatrician",
    "name": "Adolescent Medicine",
    "description": "Specializes in the health of children from 9 to 14 years old.",
    "category": "medical",
    "actor": "Adolescent Medicine Pediatrician",
    "actors": "Adolescent Medicine Pediatricians"
  },
  {
    "uid": "critical-care-pediatrician",
    "name": "Pediatric Critical Care Medicine",
    "description": "Specializes in the care of critically ill children.",
    "category": "medical",
    "actor": "Critical Care Pediatrician",
    "actors": "Critical Care Pediatricians"
  },
  {
    "uid": "cytopathologist",
    "name": "Cytopathology",
    "description": "Specializes in laboratory tests of human cells, including Pap test.",
    "category": "medical",
    "actor": "Cytopathologist",
    "actors": "Cytopathologists"
  },
  {
    "uid": "dental-assistant",
    "name": "Dental Assistant",
    "description": "An individual who may or may not have completed an accredited dental assisting education program and who aids the dentist in providing patient care services and performs other nonclinical duties in the dental office or other patient care facility.  The scope of the patient care functions that may be legally delegated to the dental assistant varies based on the needs of the dentist the educational preparation of the dental assistant and state dental practice acts and regulations.  Patient care services are provided under the supervision of a dentist.  To avoid misleading the public, no occupational title other than dental assistant should be used to describe this dental auxiliary.",
    "category": "dental",
    "actor": "Dental Assistant",
    "actors": "Dental Assistants"
  },
  {
    "uid": "dentist-dental-public-health",
    "name": "Dentist Dental Public Health",
    "description": "The science and art of preventing and controlling dental diseases and promoting dental health through organized community efforts.  It is that form of dental practice that serves the community as a patient rather than the individual.  It is concerned with the dental health education of the public, with applied dental research, and with the administration of group dental care programs as well as the prevention and control of dental diseases on a community basis.",
    "category": "dental",
    "actor": "Dentist",
    "actors": "Dentists"
  },
  {
    "uid": "anatomic-pathologist",
    "name": "Anatomic Pathology",
    "description": "Specializes in laboratory tests of tissue and bodily fluids.",
    "category": "medical",
    "actor": "Anatomic Pathologist",
    "actors": "Anatomic Pathologists"
  },
  {
    "uid": "art-therapist",
    "name": "Art Therapist",
    "description": "(1) An individual who uses art to achieve the therapeutic goals of symptom relief, emotional integration, and recovery from or adjustment to illness or disability. (2) An art therapist uses a form of treatment that enables patients with mental or physical disabilities to use art as a way of expressing and dealing with feelings and inner conflicts. (3) An individual who uses arts modalities and creative processes during intentional intervention in therapeutic, rehabilitative, community, or educational settings to foster health, communication, and expression; promote the integration of physical, emotional, cognitive, and social functioning; enhance self-awareness; and facilitate change.",
    "category": "therapy",
    "actor": "Art Therapist",
    "actors": "Art Therapists"
  },
  {
    "uid": "counceling-pshychologist",
    "name": "Counseling Psychology",
    "description": "Specializes in psychological counceling.",
    "category": "medical",
    "actor": "Counceling Psychologist",
    "actors": "Counceling Psychologists"
  },
  {
    "uid": "denturist",
    "name": "Denturist",
    "description": "Definition to come.",
    "category": "dental",
    "actor": "Denturist",
    "actors": "Denturists"
  },
  {
    "uid": "cognitive-behavioral-psychologist",
    "name": "Cognitive & Behavioral Psychology",
    "description": "Specializes in understanding and researching human behaviour.",
    "category": "medical",
    "actor": "Cognitive & Behavioral Psychologist",
    "actors": "Cognitive & Behavioral Psychologists"
  },
  {
    "uid": "child-psychiatrist",
    "name": "Child & Adolescent Psychiatry",
    "description": "Specializes in the diagnosis and treatment of children's mental disorders.",
    "category": "medical",
    "actor": "Child Psychiatrist",
    "actors": "Child Psychiatrists"
  },
  {
    "uid": "dentist-dentist-anesthesiologist",
    "name": "Dentist Dentist Anesthesiologist",
    "description": "A dentist who has successfully completed an accredited postdoctoral anesthesiology residency training program for dentists of two or more years duration, in accord with Commission on Dental Accreditation's Standards for Dental Anesthesiology Residency Programs, and/or meets the eligibility requirements for examination by the American Dental Board of Anesthesiology.",
    "category": "dental",
    "actor": "Dentist Dentist Anesthesiologist",
    "actors": "Dentist Dentist Anesthesiologists"
  },
  {
    "uid": "dermatopathologist",
    "name": "Dermatopathology",
    "description": "Specializes in diagnoses and monitoring skin diseases.",
    "category": "medical",
    "actor": "Dermatopathologist",
    "actors": "Dermatopathologists"
  },
  {
    "uid": "diagnostic-neuroimaging-radiologist",
    "name": "Diagnostic Neuroimaging",
    "description": "Specializes in computer imaging including MRI and CT scans.",
    "category": "medical",
    "actor": "Diagnostic Neuroimaging Radiologist",
    "actors": "Diagnostic Neuroimaging Radiologists"
  },
  {
    "uid": "family-nurse-practitioner",
    "name": "Family Nurse Practitioner",
    "description": "Specializes in your and your family's health.",
    "category": "medical",
    "actor": "Family Nurse Practitoner",
    "actors": "Family Nurse Practitoners"
  },
  {
    "uid": "hospice-palliative-medicine-anesthesiologist",
    "name": "Hospice and Palliative Medicine",
    "description": "Specializes in relieving the suffering of dying patients.",
    "category": "medical",
    "actor": "Hospice and Palliative Medicine Anesthesiologist",
    "actors": "Hospice and Palliative Medicine Anesthesiologists"
  },
  {
    "uid": "hospice-palliative-physiatrist",
    "name": "Hospice and Palliative Medicine",
    "description": "Specializes in reliving the suffering of dying patients.",
    "category": "medical",
    "actor": "Hospice and Palliative Physiatrist",
    "actors": "Hospice and Palliative Physiatrists"
  },
  {
    "uid": "hospitalist",
    "name": "Hospitalist",
    "description": "Specializes in general medical care of hospitalized patients.",
    "category": "medical",
    "actor": "Hospitalist",
    "actors": "Hospitalists"
  },
  {
    "uid": "head-neck-plastic-surgeon",
    "name": "Plastic Surgery within the Head & Neck",
    "description": "Specializes in head and neck plastic and reconstructive surgery.",
    "category": "medical",
    "actor": "Head & Neck Plastic Surgeon",
    "actors": "Head & Neck Plastic Surgeons"
  },
  {
    "uid": "general-practitioner",
    "name": "General Practice",
    "description": "Specializes and treats your total health.",
    "category": "medical",
    "actor": "General Practitioner",
    "actors": "General Practitioners"
  },
  {
    "uid": "general-surgeon",
    "name": "Surgery",
    "description": "Specializes in complex surgical operations.",
    "category": "medical",
    "actor": "General Surgeon",
    "actors": "General Surgeons"
  },
  {
    "uid": "gynecologist",
    "name": "Gynecology",
    "description": "Specializes in the care of the female reproductive system.",
    "category": "medical",
    "actor": "Gynecologist",
    "actors": "Gynecologists"
  },
  {
    "uid": "internist-chiropractor",
    "name": "Chiropractic Internal Medicine",
    "description": "Specializes in alternartive therapy of muscles, bones, and joints.",
    "category": "medical",
    "actor": "Internal Medicine Chiropractor",
    "actors": "Internal Medicine Chiropractors"
  },
  {
    "uid": "massage-therapist",
    "name": "Massage Therapy",
    "description": "Specializes in alternative therapy of muscles and tissue.",
    "category": "medical",
    "actor": "Massage Therapist",
    "actors": "Massage Therapists"
  },
  {
    "uid": "neuroradiologist",
    "name": "Neuroradiology",
    "description": "Specializes in imaging of the brain, spine and spinal cord.",
    "category": "medical",
    "actor": "Neuroradiologist",
    "actors": "Neuroradiologists"
  },
  {
    "uid": "nuclear-radiologist",
    "name": "Nuclear Radiology",
    "description": "Specializes in imaging with radiologic substances.",
    "category": "medical",
    "actor": "Nuclear Radiologist",
    "actors": "Nuclear Radiologists"
  },
  {
    "uid": "occupational-therapist-human-factors",
    "name": "Occupational Therapist Human Factors",
    "description": "Definition to come...",
    "category": "therapy",
    "actor": "Occupational Therapist Human Factor",
    "actors": "Occupational Therapist Human Factors"
  },
  {
    "uid": "internal-medicine-allergy-immunology",
    "name": "Internal Medicine Allergy & Immunology",
    "description": "An internist doctor of osteopathy that specializes in the treatment of allergy and immunologic disorders.  A doctor of osteopathy that is board eligible/certified by the American Osteopathic Board of Internal Medicine can obtain a Certificate of Special Qualifications in the field of Allergy & Immunology.",
    "category": "medical",
    "actor": "Internal Medicine Allergy & Immunology",
    "actors": "Internal Medicine Allergy & Immunologies"
  },
  {
    "uid": "internal-medicine-magnetic-resonance-imaging-mri",
    "name": "Internal Medicine Magnetic Resonance Imaging (MRI)",
    "description": "Definition to come.",
    "category": "medical",
    "actor": "Internal Medicine Magnetic Resonance Imaging (MRI)",
    "actors": "Internal Medicine Magnetic Resonance Imaging (MRI)S"
  },
  {
    "uid": "podiatrist-general-practice",
    "name": "Podiatrist General Practice",
    "description": "",
    "category": "medical",
    "actor": "Podiatrist",
    "actors": "Podiatrists"
  },
  {
    "uid": "occupational-therapist-physical-rehabilitation",
    "name": "Occupational Therapist Physical Rehabilitation",
    "description": "Occupational therapists are experts at helping people lead as independent a life as possible.  Occupational therapists bring an understanding of the physical and psychological implications of illness and injury and their effects on peoples' ability to perform the tasks of daily living.  Occupational therapists provide interventions that can aide a person in completing ADL and IADL tasks, such as dressing, bathing, preparing meals, and driving.  They also may fabricate custom orthotics to improve function, evaluate the environment for safety hazards and recommend adaptations to remove those hazards, help a person compensate for cognitive changes, and build a persons' physical endurance and strength. Occupational therapists' knowledge of adapting tasks and modifying the environment to compensate for functional limitations is used to increase the involvement of clients and to promote safety and success.",
    "category": "therapy",
    "actor": "Occupational Therapist Physical Rehabilitation",
    "actors": "Occupational Therapist Physical Rehabilitations"
  },
  {
    "uid": "occupational-therapy-assistant-environmental-modification",
    "name": "Occupational Therapy Assistant Environmental Modification",
    "description": "Occupational therapy assistants provide environmental modifications under the supervision of an occupational therapist.  OTAs develop and implement an individualized occupational therapy environmental modification plan that reflects the relevant contexts of the client and relevant others and maximizes current and future occupational performance, safety, and participation of the client. Clients receive environmental modification recommendations and interventions that enable them to meet occupational performance and participation goals and that have adequate flexibility to accommodate for their future needs.",
    "category": "therapy",
    "actor": "Occupational Therapy Assistant Environmental Modification",
    "actors": "Occupational Therapy Assistant Environmental Modifications"
  },
  {
    "uid": "medical-oncologist",
    "name": "Medical Oncology",
    "description": "Specializes in the diagnosis and treatment of cancer and tumors.",
    "category": "medical",
    "actor": "Medical Oncologist",
    "actors": "Medical Oncologists"
  },
  {
    "uid": "nurse-practitioner",
    "name": "Nurse Practitioner",
    "description": "Specializes in your and your family's health.",
    "category": "medical",
    "actor": "General Nurse Practitoner",
    "actors": "General Nurse Practitoners"
  },
  {
    "uid": "optometrist",
    "name": "Optometry",
    "description": "Specializes in vision and prescribing glasses and contact lenses.",
    "category": "vision",
    "actor": "Optometrist",
    "actors": "Optometrists"
  },
  {
    "uid": "urology-female-pelvic-medicine-and-reconstructive-surgery",
    "name": "Urology Female Pelvic Medicine and Reconstructive Surgery",
    "description": "A subspecialist in Female Pelvic Medicine and Reconstructive Surgery is a physician in Urology or Obstetrics and Gynecology who, by virtue of education and training, is prepared to provide consultation and comprehensive management of women with complex benign pelvic conditions, lower urinary tract disorders, and pelvic floor dysfunction. Comprehensive management includes those diagnostic and therapeutic procedures necessary for the total care of the patient with these conditions and complications resulting from them.",
    "category": "medical",
    "actor": "Urology Female Pelvic Medicine and Reconstructive Surgery",
    "actors": "Urology Female Pelvic Medicine and Reconstructive Surgeries"
  },
  {
    "uid": "oral-radiologist",
    "name": "Oral and Maxillofacial Radiology",
    "description": "Specializes in X-rays of the mouth, jaw and face.",
    "category": "medical",
    "actor": "Oral Radiologist",
    "actors": "Oral Radiologists"
  },
  {
    "uid": "orthodontist",
    "name": "Orthodontics",
    "description": "Specializes in the correction of teeth and surrounding structures.",
    "category": "dental",
    "actor": "Orthodontist",
    "actors": "Orthodontists"
  },
  {
    "uid": "diagnostic-radiologist",
    "name": "Diagnostic Radiology",
    "description": "Specializes in imaging via X-rays and ultrasound.",
    "category": "medical",
    "actor": "Diagnostic Radiologist",
    "actors": "Diagnostic Radiologists"
  },
  {
    "uid": "endocrinologist",
    "name": "Endocrinology, Diabetes & Metabolism",
    "description": "Specializes in diabetes, thyroid and other disorders affected by hormones.",
    "category": "medical",
    "actor": "Endocrinologist",
    "actors": "Endocrinologists"
  },
  {
    "uid": "endotontist",
    "name": "Endodontics",
    "description": "Specializes in root canal and other similar issues.",
    "category": "dental",
    "actor": "Endotontist",
    "actors": "Endotontists"
  },
  {
    "uid": "family-medicine-geriatric-medicine",
    "name": "Family Medicine Geriatric Medicine",
    "description": "A family medicine physician with special knowledge of the aging process and special skills in the diagnostic, therapeutic, preventive and rehabilitative aspects of illness in the elderly. This specialist cares for geriatric patients in the patient's home, the office, long-term care settings such as nursing homes, and the hospital.",
    "category": "medical",
    "actor": "Family Medicine Geriatric Medicine",
    "actors": "Family Medicine Geriatric Medicines"
  },
  {
    "uid": "family-medicine-bariatric-medicine",
    "name": "Family Medicine Bariatric Medicine",
    "description": "Bariatric medicine is the medical treatment of obesity and its associated conditions.  Bariatric medicine addresses the obese individual with a comprehensive program of diet, exercise and behavior modification, and when indicated, the prescription of appropriate medications as determined by the Bariatric physician.  Bariatric physicians are licensed physicians who offer specialized programs in the medical treatment of obesity and its associated conditions. ",
    "category": "medical",
    "actor": "Family Medicine Bariatric Medicine",
    "actors": "Family Medicine Bariatric Medicines"
  },
  {
    "uid": "vivo-vitro-nuclear-medicine-doctor",
    "name": "In Vivo & In Vitro Nuclear Medicine",
    "description": "Specializes in diagnosing and treating diseases with radioactive materials.",
    "category": "medical",
    "actor": "In Vivo & In Vitro Nuclear Medicine Doctor",
    "actors": "In Vivo & In Vitro Nuclear Medicine Doctors"
  },
  {
    "uid": "interventional-pain-management-doctor",
    "name": "Interventional Pain Medicine",
    "description": "Specializes in pain management and prevention.",
    "category": "medical",
    "actor": "Interventional Pain Management Doctor",
    "actors": "Interventional Pain Management Doctors"
  },
  {
    "uid": "mastectomy-fitter",
    "name": "Mastectomy Fitter",
    "description": "An individual trained in the fitting and adjusting of breast prostheses and management of post-mastectomy prostheses services.",
    "category": "services",
    "actor": "Mastectomy Fitter",
    "actors": "Mastectomy Fitters"
  },
  {
    "uid": "maternal-fetal-medicine-obgyn",
    "name": "Maternal & Fetal Medicine",
    "description": "Specializes in high-risk pregnancies and pregnancy complications.",
    "category": "medical",
    "actor": "Maternal & Fetal OBGYN",
    "actors": "Maternal & Fetal OBGYNS"
  },
  {
    "uid": "pediatric-oncologist",
    "name": "Pediatric Hematology & Oncology",
    "description": "Specializes in disorders that involve blood, spleen and lymph as well as cancer or other tumors.",
    "category": "medical",
    "actor": "Pediatric Hematology & Oncologist",
    "actors": "Pediatric Hematology & Oncologists"
  },
  {
    "uid": "pediatric-pathologist",
    "name": "Pediatric Pathology",
    "description": "Specializes in laboratory tests of tissue and bodily fluids in children.",
    "category": "medical",
    "actor": "Pediatric Pathologist",
    "actors": "Pediatric Pathologists"
  },
  {
    "uid": "pediatric-transplant-hepatologist",
    "name": "Pediatric Transplant Hepatology",
    "description": "Specializes in children's liver transplants.",
    "category": "medical",
    "actor": "Pediatric Transplant Hepatologist",
    "actors": "Pediatric Transplant Hepatologists"
  },
  {
    "uid": "psychiatry-neurology-bariatric-medicine",
    "name": "Psychiatry & Neurology Bariatric Medicine",
    "description": "Bariatric medicine is the medical treatment of obesity and its associated conditions.  Bariatric medicine addresses the obese individual with a comprehensive program of diet, exercise and behavior modification, and when indicated, the prescription of appropriate medications as determined by the Bariatric physician.  Bariatric physicians are licensed physicians who offer specialized programs in the medical treatment of obesity and its associated conditions. ",
    "category": "medical",
    "actor": "Psychiatry & Neurology Bariatric Medicine",
    "actors": "Psychiatry & Neurology Bariatric Medicines"
  },
  {
    "uid": "psychiatry-neurology-hospice-and-palliative-medicine",
    "name": "Psychiatry & Neurology Hospice and Palliative Medicine",
    "description": "A psychiatrist or neurologist with special knowledge and skills to prevent and relieve the suffering experienced by patients with life-limiting illnesses. This specialist works with an interdisciplinary hospice or palliative care team to maximize quality of life while addressing physical, psychological, social and spiritual needs of both patient and family throughout the course of the disease, through the dying process, and beyond for the family.  This specialist has expertise in the assessment of patients with advanced disease; the relief of distressing symptoms; the coordination of interdisciplinary patient and family-centered care in diverse venues; the use of specialized care systems including hospice; the management of the imminently dying patient; and legal and ethical decision making in end-of-life care.",
    "category": "medical",
    "actor": "Psychiatry & Neurology Hospice and Palliative Medicine",
    "actors": "Psychiatry & Neurology Hospice and Palliative Medicines"
  },
  {
    "uid": "podiatrist-public-medicine",
    "name": "Podiatrist Public Medicine",
    "description": "Definition to come...",
    "category": "medical",
    "actor": "Podiatrist",
    "actors": "Podiatrists"
  },
  {
    "uid": "preventive-sports-medicine-doctor",
    "name": "Preventive Sports Medicine",
    "description": "Specializes in sport related preventive care.",
    "category": "medical",
    "actor": "Preventive Sports Medicine Doctor",
    "actors": "Preventive Sports Medicine Doctors"
  },
  {
    "uid": "neurologist",
    "name": "Neurology",
    "description": "Specializes in the brain and nervous system.",
    "category": "medical",
    "actor": "Neurologist",
    "actors": "Neurologists"
  },
  {
    "uid": "neurodevelopmental-disability-pediatrician",
    "name": "Neurodevelopmental Disability",
    "description": "Specializes in developmental delays or learning disorders in children.",
    "category": "medical",
    "actor": "Neurodevelopmental Disability Pediatrician",
    "actors": "Neurodevelopmental Disability Pediatricians"
  },
  {
    "uid": "otolaryngic-allergist",
    "name": "Otolaryngic Allergy",
    "description": "Specializes in ear, nose and throat allergies.",
    "category": "medical",
    "actor": "Otolaryngic Allergist",
    "actors": "Otolaryngic Allergists"
  },
  {
    "uid": "neurology-physical-therapist",
    "name": "Neurology Physical Therapy",
    "description": "Specializes in nervous system physical therapy.",
    "category": "medical",
    "actor": "Neurology Physical Therapist",
    "actors": "Neurology Physical Therapists"
  },
  {
    "uid": "pediatric-nephrologist",
    "name": "Pediatric Nephrology",
    "description": "Specializes in children's kidney disorders.",
    "category": "medical",
    "actor": "Pediatric Nephrologist",
    "actors": "Pediatric Nephrologists"
  },
  {
    "uid": "pediatric-neurologist",
    "name": "Pediatric Neurology",
    "description": "Specializes in children's brain and nervous system.",
    "category": "medical",
    "actor": "Pediatric Neurologist",
    "actors": "Pediatric Neurologists"
  },
  {
    "uid": "periodontist",
    "name": "Periodontics",
    "description": "Specializes in gums and bones that support your teeth.",
    "category": "dental",
    "actor": "Periodontist",
    "actors": "Periodontists"
  },
  {
    "uid": "plastic-surgery-surgery-of-the-hand",
    "name": "Plastic Surgery Surgery of the Hand",
    "description": "A plastic surgeon with additional training in the investigation, preservation, and restoration by medical, surgical and rehabilitative means of all structures of the upper extremity directly affecting the form and function of the hand and wrist.",
    "category": "medical",
    "actor": "Plastic Surgery Surgery of the Hand",
    "actors": "Plastic Surgery Surgery of the Hands"
  },
  {
    "uid": "psychoanalyst",
    "name": "Psychoanalysis",
    "description": "Specializes in psychoanalysis techniques developed by Sigmund Freud.",
    "category": "medical",
    "actor": "Psychoanalyst",
    "actors": "Psychoanalysts"
  },
  {
    "uid": "psychologist",
    "name": "Psychology",
    "description": "Specializes in psychological counceling and therapy.",
    "category": "medical",
    "actor": "Psychologist",
    "actors": "Psychologists"
  },
  {
    "uid": "respiratory-therapist-certified-patient-transport",
    "name": "Respiratory Therapist, Certified Patient Transport",
    "description": "Transport respiratory therapist provide patient assessment, initiation of treatment modalities and continued monitoring of patient status of the critically ill and injured patients with special attention to advanced airway and ventilator management.  The transport respiratory therapist knowledge and experience with complex neonatal, pediatric and adult patient care issues provides them with an expertise to assist with any patient care issue in a variety of transport modes.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified Patient Transport",
    "actors": "Respiratory Therapist, Certified Patient Transports"
  },
  {
    "uid": "rehabilitation-practitioner",
    "name": "Rehabilitation Practitioner",
    "description": "A health care practitioner who trains or retrains individuals disabled by disease or injury to help them attain their maximum functional capacity.",
    "category": "therapy",
    "actor": "Rehabilitation Practitioner",
    "actors": "Rehabilitation Practitioners"
  },
  {
    "uid": "recreation-therapist",
    "name": "Recreation Therapist",
    "description": "A recreation therapist uses recreational activities for intervention in some physical, social or emotional behavior to bring about a desired change in that behavior and promote the growth and development of the patient.",
    "category": "therapy",
    "actor": "Recreation Therapist",
    "actors": "Recreation Therapists"
  },
  {
    "uid": "radiation-oncologist",
    "name": "Radiation Oncology",
    "description": "Specializes in radiation treatment of cancer and tumors.",
    "category": "medical",
    "actor": "Radiation Oncologist",
    "actors": "Radiation Oncologists"
  },
  {
    "uid": "rehabilitation-counselor-orientation-and-mobility-training-provider",
    "name": "Rehabilitation Counselor Orientation and Mobility Training Provider",
    "description": "Orientation and Mobility (O&M) specialists teach children and adults who have visual impairments the specific orientation skills used to find one's way in the environment and the mobility skills needed to travel safely and efficiently at home, school, work, and in the community. Instruction is usually provided one-on-one and can include skills such as how to use a long cane, the operation of low vision devices and electronic travel aids when appropriate, how to orient oneself to new environments, navigate public transportation systems, how to cross streets safely, and traveling by using hearing, remaining vision, and other senses.  In addition, O&M Specialists help children to develop fundamental skills such as fine and gross motor skills, concept development and problem solving skills. Adult clients can also benefit from an O&M specialist evaluating their current use of travel-related skills, discussing their future goals, and helping them select a program of instruction that will allow them to reach their greatest travel potential.",
    "category": "therapy",
    "actor": "Rehabilitation Counselor Orientation and Mobility Training Provider",
    "actors": "Rehabilitation Counselor Orientation and Mobility Training Providers"
  },
  {
    "uid": "techniciantechnologist-contact-lens-fitter",
    "name": "Technician/Technologist Contact Lens Fitter",
    "description": "An optician or other ancillary support staff person who, where authorized by state law and trained or certified to do so, may fit or dispense contact lenses to a patient based on the prescription of an optometrist or medical physician.",
    "category": "vision",
    "actor": "Technician/Technologist Contact Lens Fitter",
    "actors": "Technician/Technologist Contact Lens Fitters"
  },
  {
    "uid": "techniciantechnologist-ophthalmic-assistant",
    "name": "Technician/Technologist Ophthalmic Assistant",
    "description": "Definition to come...",
    "category": "vision",
    "actor": "Technician/Technologist Ophthalmic Assistant",
    "actors": "Technician/Technologist Ophthalmic Assistants"
  },
  {
    "uid": "techniciantechnologist-optometric-assistant",
    "name": "Technician/Technologist Optometric Assistant",
    "description": "Definition to come...",
    "category": "vision",
    "actor": "Technician/Technologist Optometric Assistant",
    "actors": "Technician/Technologist Optometric Assistants"
  },
  {
    "uid": "school-psychologist",
    "name": "School Psychology",
    "description": "Specializes in counceling and therapy in schools.",
    "category": "medical",
    "actor": "School Psychologist",
    "actors": "School Psychologists"
  },
  {
    "uid": "specialisttechnologist-athletic-trainer",
    "name": "Specialist/Technologist Athletic Trainer",
    "description": "Athletic trainers are allied health care professionals who work in consultation with or under the direction of physicians, and specialize in the prevention, assessment, treatment and rehabilitation of injuries and illnesses.  Currently, the entry-level employment requirements are a bachelor's degree with a major in athletic training from an accredited university or college. A majority of athletic trainers hold advanced degrees.  National board certification is generally required as a condition of state licensure and employment. Most states regulate athletic trainers, and they practice within the scope of that license or regulation.  Clinical practice includes emergency care, rehabilitation, reconditioning, therapeutic exercise, wellness programs, exercise physiology, kinesiology, biomechanics, nutrition, psychology and health care administration.",
    "category": "therapy",
    "actor": "Specialist/Technologist Athletic Trainer",
    "actors": "Specialist/Technologist Athletic Trainers"
  },
  {
    "uid": "respiratory-therapist-registered-pulmonary-rehabilitation",
    "name": "Respiratory Therapist, Registered Pulmonary Rehabilitation",
    "description": "The respiratory therapist can assist the chronic pulmonary patient in returning to an optimal role in society by providing an effective program.  It includes bronchopulmonary drainage, exercise therapy, and patient education.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered Pulmonary Rehabilitation",
    "actors": "Respiratory Therapist, Registered Pulmonary Rehabilitations"
  },
  {
    "uid": "surgery-surgical-critical-care",
    "name": "Surgery Surgical Critical Care",
    "description": "A surgeon with expertise in the management of the critically ill and postoperative patient, particularly the trauma victim, who specializes in critical care medicine diagnoses, treats and supports patients with multiple organ dysfunction. This specialist may have administrative responsibilities for intensive care units and may also facilitate and coordinate patient care among the primary physician, the critical care staff and other specialists.",
    "category": "medical",
    "actor": "Surgery Surgical Critical Care",
    "actors": "Surgery Surgical Critical Cares"
  },
  {
    "uid": "surgery-trauma-surgery",
    "name": "Surgery Trauma Surgery",
    "description": "Trauma surgery is a recognized subspecialty of general surgery. Trauma surgeons are physicians who have completed a five-year general surgery residency and usually continue with a one to two year fellowship in trauma and/or surgical critical care, typically leading to additional board certification in surgical critical care. There is no trauma surgery board certification at this point. To obtain board certification in surgical critical care, a fellowship in surgical critical care or anesthesiology critical care must be completed during or after general surgery residency.",
    "category": "medical",
    "actor": "Surgery Trauma Surgery",
    "actors": "Surgery Trauma Surgeries"
  },
  {
    "uid": "surgical-oncologist",
    "name": "Surgical Oncology",
    "description": "Specializes in the branch of surgery which focuses on the surgical management of cancer.",
    "category": "medical",
    "actor": "Surgical Oncologist",
    "actors": "Surgical Oncologists"
  },
  {
    "uid": "techniciantechnologist-ophthalmic",
    "name": "Technician/Technologist Ophthalmic",
    "description": "Definition to come...",
    "category": "vision",
    "actor": "Technician/Technologist Ophthalmic",
    "actors": "Technician/Technologist Ophthalmics"
  },
  {
    "uid": "respiratory-therapist-registered-general-care",
    "name": "Respiratory Therapist, Registered General Care",
    "description": "This level of care includes diagnostics testing, therapeutics, monitoring, rehabilitation of patients with disorders of the cardiopulmonary system, as well as, education of the patient and family in regard to those disorders.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered General Care",
    "actors": "Respiratory Therapist, Registered General Cares"
  },
  {
    "uid": "respiratory-therapist-registered-patient-transport",
    "name": "Respiratory Therapist, Registered Patient Transport",
    "description": "Transport respiratory therapist provide patient assessment, initiation of treatment modalities and continued monitoring of patient status of the critically ill and injured patients with special attention to advanced airway and ventilator management.  The transport respiratory therapist knowledge and experience with complex neonatal, pediatric and adult patient care issues provides them with an expertise to assist with any patient care issue in a variety of transport modes.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered Patient Transport",
    "actors": "Respiratory Therapist, Registered Patient Transports"
  },
  {
    "uid": "respiratory-therapist-registered-palliativehospice",
    "name": "Respiratory Therapist, Registered Palliative/Hospice",
    "description": "A coordinated plan of care to help dying patients and their families handle the burden of terminal care.  Effective secretion management and relief of dyspnea are paramount in caring for patients with end-stage pulmonary disease.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered Palliative/Hospice",
    "actors": "Respiratory Therapist, Registered Palliative/Hospices"
  },
  {
    "uid": "sports-chiropractor",
    "name": "Chiropractic Sports Medicine",
    "description": "Specializes in alternartive therapy of muscles, bones, and joints.",
    "category": "medical",
    "actor": "Sports Chiropractor",
    "actors": "Sports Chiropractors"
  },
  {
    "uid": "specialisttechnologist",
    "name": "Specialist/Technologist",
    "description": "General classification identifying individuals who are trained on a specific piece of equipment or technical procedure.",
    "category": "services",
    "actor": "Specialist/Technologist",
    "actors": "Specialist/Technologists"
  },
  {
    "uid": "respiratory-therapist-registered-educational",
    "name": "Respiratory Therapist, Registered Educational",
    "description": "The focus of patient and family education activities is to promote knowledge of disease process, medical therapy, and self help.  Respiratory therapists are uniquely qualified to provide this service in regard to cardiopulmonary diseases and injury.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered Educational",
    "actors": "Respiratory Therapist, Registered Educationals"
  },
  {
    "uid": "respiratory-therapist-registered-emergency-care",
    "name": "Respiratory Therapist, Registered Emergency Care",
    "description": "The immediate availability of diagnostic and therapeutic cardiopulmonary services in the assessment and management of trauma victims, patients requiring airway management and others requiring emergency care.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered Emergency Care",
    "actors": "Respiratory Therapist, Registered Emergency Cares"
  },
  {
    "uid": "spine-orthopedist",
    "name": "Orthopedic Surgery of the Spine",
    "description": "Specializes in spine surgery and treatment.",
    "category": "medical",
    "actor": "Spine Surgeon",
    "actors": "Spine Surgeons"
  },
  {
    "uid": "respiratory-therapist-registered-home-health",
    "name": "Respiratory Therapist, Registered Home Health",
    "description": "Home care fosters individual responsibility for self-management of chronic respiratory conditions.  It includes individualized assessment based plans of care service developed to promote safe, proper, and sustained use of prescribed respiratory therapy medications, equipment, and techniques in the home.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered Home Health",
    "actors": "Respiratory Therapist, Registered Home Healths"
  },
  {
    "uid": "techniciantechnologist-contact-lens",
    "name": "Technician/Technologist Contact Lens",
    "description": "An optician or other ancillary support staff person who, where authorized by state law and trained or certified to do so, may fit or dispense contact lenses to a patient based on the prescription of an optometrist or medical physician.",
    "category": "vision",
    "actor": "Technician/Technologist Contact Len",
    "actors": "Technician/Technologist Contact Lens"
  },
  {
    "uid": "trauma-orthopedist",
    "name": "Orthopedic Trauma",
    "description": "Specializes in acute orthopedic injuries, including hip treatments.",
    "category": "medical",
    "actor": "Trauma Orthopedist",
    "actors": "Trauma Orthopedists"
  },
  {
    "uid": "undersea-hyperbaric-medicine-doctor",
    "name": "Undersea and Hyperbaric Medicine",
    "description": "Specializes in diving related illnesses.",
    "category": "medical",
    "actor": "Undersea and Hyperbaric Medicine Doctor",
    "actors": "Undersea and Hyperbaric Medicine Doctors"
  },
  {
    "uid": "techniciantechnologist-optician",
    "name": "Technician/Technologist Optician",
    "description": "Definition to come...",
    "category": "vision",
    "actor": "Technician/Technologist Optician",
    "actors": "Technician/Technologist Opticians"
  },
  {
    "uid": "techniciantechnologist-optometric-technician",
    "name": "Technician/Technologist Optometric Technician",
    "description": "Definition to come...",
    "category": "vision",
    "actor": "Technician/Technologist Optometric Technician",
    "actors": "Technician/Technologist Optometric Technicians"
  },
  {
    "uid": "transplant-surgery",
    "name": "Transplant Surgery",
    "description": "Definition to come.",
    "category": "medical",
    "actor": "Transplant Surgery",
    "actors": "Transplant Surgeries"
  },
  {
    "uid": "addiction-psychologist",
    "name": "Addiction Psychology",
    "description": "Specialzes in helping patients with physical and mental addictions.",
    "category": "medical",
    "actor": "Addiction Psychologist",
    "actors": "Addiction Psychologists"
  },
  {
    "uid": "allergist",
    "name": "Allergy & Immunology",
    "description": "Specializes in treatment of allergies and the immune system.",
    "category": "medical",
    "actor": "Allergist",
    "actors": "Allergists"
  },
  {
    "uid": "corneal-contact-management-optometrist",
    "name": "Corneal and Contact Management",
    "description": "Specializes in contact lenses.",
    "category": "vision",
    "actor": "Corneal and Contact Management Optometrist",
    "actors": "Corneal and Contact Management Optometrists"
  },
  {
    "uid": "colorectal-surgeon",
    "name": "Colon & Rectal Surgery",
    "description": "Specializes in colon and rectal surgery.",
    "category": "medical",
    "actor": "Colorectal Surgeon",
    "actors": "Colorectal Surgeons"
  },
  {
    "uid": "critical-care-anesthesiologist",
    "name": "Critical Care Medicine",
    "description": "Specializes in managing anesthesia in critical surgeries.",
    "category": "medical",
    "actor": "Critical Care Anesthesiologist",
    "actors": "Critical Care Anesthesiologists"
  },
  {
    "uid": "counselor-specialist",
    "name": "Counseling",
    "description": "Specializes in behavioral health service counseling.",
    "category": "medical",
    "actor": "Counselor",
    "actors": "Counselors"
  },
  {
    "uid": "dental-hygienist",
    "name": "Dental Hygienist",
    "description": "An individual who has completed an accredited dental hygiene education program, and an individual who has been licensed by a state board of dental examiners to provide preventive care services under the supervision of a dentist.  Functions that may be legally delegated to the dental hygienist vary based on the needs of the dentist, the educational preparation of the dental hygienist and state dental practice acts and regulations, but always include, at a minimum, scaling and polishing the teeth.  To avoid misleading the public, no occupational title other than dental hygienist should be used to describe this dental auxiliary.",
    "category": "dental",
    "actor": "Dental Hygienist",
    "actors": "Dental Hygienists"
  },
  {
    "uid": "health-psychologist",
    "name": "Health Psychology",
    "description": "Specializes in counceling of patients with physical health problems.",
    "category": "medical",
    "actor": "Health Psychologist",
    "actors": "Health Psychologists"
  },
  {
    "uid": "human-factor-physical-therapist",
    "name": "Human Factor Physical Therapy",
    "description": "Specializes in physical therapy.",
    "category": "medical",
    "actor": "Human Factors Physical Therapist",
    "actors": "Human Factors Physical Therapists"
  },
  {
    "uid": "geneticist",
    "name": "Medical Genetics, Ph.D. Medical Genetics",
    "description": "Specializes in the diagnoses of and counselling for genetic disorders.",
    "category": "medical",
    "actor": "Geneticist",
    "actors": "Geneticists"
  },
  {
    "uid": "geriatric-physical-therapist",
    "name": "Geriatrics Physical Therapy",
    "description": "Specializes in physical therapy for the elderly.",
    "category": "medical",
    "actor": "Geriatric Physical Therapist",
    "actors": "Geriatric Physical Therapists"
  },
  {
    "uid": "hand-physical-therapist",
    "name": "Hand Physical Therapy",
    "description": "Specializes in physical therapy of the hands.",
    "category": "medical",
    "actor": "Hand Physical Therapist",
    "actors": "Hand Physical Therapists"
  },
  {
    "uid": "foot-ankle-orthopedist",
    "name": "Foot and Ankle Surgery",
    "description": "Specializes in foot and ankle surgery.",
    "category": "medical",
    "actor": "Foot and Ankle Surgeon",
    "actors": "Foot and Ankle Surgeons"
  },
  {
    "uid": "family-psychologist",
    "name": "Family Psychology",
    "description": "Specializes in family counceling and therapy.",
    "category": "medical",
    "actor": "Family Psychologist",
    "actors": "Family Psychologists"
  },
  {
    "uid": "gastroenterologist",
    "name": "Gastroenterology",
    "description": "Specializes in the digestive system.",
    "category": "medical",
    "actor": "Gastroenterologist",
    "actors": "Gastroenterologists"
  },
  {
    "uid": "family-practitioner",
    "name": "Family Medicine",
    "description": "Specializes in your and your family's total health.",
    "category": "medical",
    "actor": "Family Practitioner",
    "actors": "Family Practitioners"
  },
  {
    "uid": "occupational-therapist-feeding-eating-swallowing",
    "name": "Occupational Therapist Feeding, Eating & Swallowing",
    "description": "Occupational therapists provide interventions to clients of all ages with feeding, eating and swallowing difficulties.  Occupational therapists provide comprehensive rehabilitative, habilitative, and palliative dysphagia care, which includes collaborating with clients to provide individualized compensatory swallowing strategies, modified diet textures, adapted mealtime environments, enhanced feeding skills, preparatory exercises and positioning to clients, reinforcement of mealtime strategies to enhance and improve swallowing skills, and training to caregivers to enhance eating and feeding performance.  Occupational therapists provide screening and in-depth clinical assessment which may include instrumental dysphagia assessments including videofluroscopy.",
    "category": "therapy",
    "actor": "Occupational Therapist Feeding, Eating & Swallowing",
    "actors": "Occupational Therapist Feeding, Eating & Swallowings"
  },
  {
    "uid": "occupational-therapist-gerontology",
    "name": "Occupational Therapist Gerontology",
    "description": "Occupational therapists work with older adults in virtually every setting: assisted living, wellness programs, hospitals, nursing homes, senior centers, clinics and in the home. Occupational therapists bring an understanding of the importance of participation and occupation for overall well-being to those who are experiencing disabling conditions related to aging. The primary overarching goal of occupational therapy services with this population is to maximize independence and participation, thereby enabling an older person to continue to live successfully in his or her chosen environment. Occupational therapists can help older adults by developing strategies to help or maintain safety and well-being, to assist with life transitions, and to compensate for challenges they experience in activities of daily living, instrumental activities of daily living, leisure participation, social participation, and productive activities.",
    "category": "therapy",
    "actor": "Occupational Therapist Gerontology",
    "actors": "Occupational Therapist Gerontologies"
  },
  {
    "uid": "neuromuscular-physiatrist",
    "name": "Neuromuscular Medicine",
    "description": "Specializes in neuromuscular medicine.",
    "category": "medical",
    "actor": "Neuromuscular Physiatrist",
    "actors": "Neuromuscular Physiatrists"
  },
  {
    "uid": "occupational-therapist-hand",
    "name": "Occupational Therapist Hand",
    "description": "Definition to come...",
    "category": "therapy",
    "actor": "Occupational Therapist Hand",
    "actors": "Occupational Therapist Hands"
  },
  {
    "uid": "hospice-palliative-medicine-radiologist",
    "name": "Hospice and Palliative Medicine",
    "description": "Specializes in relieving the suffering of dying patients.",
    "category": "medical",
    "actor": "Hospice and Palliative Medicine Radiologist",
    "actors": "Hospice and Palliative Medicine Radiologists"
  },
  {
    "uid": "immunopathologist",
    "name": "Immunopathology",
    "description": "Specializes in the diagnosis of immunologic diseases.",
    "category": "medical",
    "actor": "Immunopathologist",
    "actors": "Immunopathologists"
  },
  {
    "uid": "occupational-therapist-neurorehabilitation",
    "name": "Occupational Therapist Neurorehabilitation",
    "description": "Definition to come...",
    "category": "therapy",
    "actor": "Occupational Therapist Neurorehabilitation",
    "actors": "Occupational Therapist Neurorehabilitations"
  },
  {
    "uid": "oral-medicinist",
    "name": "Oral Medicinist",
    "description": "A dentist with advanced training specializing in the recognition and treatment of oral conditions resulting from the interrelationship between oral disease and systemic health. The Oral Medicinist manages clinical and non-surgical treatment of non-dental pathologies affecting the oral and maxillofacial region, such as cancer, organ transplants, and acute and chronic pain. Activities include provision of interdisciplinary patient care in collaboration with medical specialists and other dentists in hospitals and outpatient medical clinics in the management of patients with complex medical conditions requiring multidisciplinary healthcare intervention.",
    "category": "dental",
    "actor": "Oral Medicinist",
    "actors": "Oral Medicinists"
  },
  {
    "uid": "oral-maxillofacial-surgeon",
    "name": "Oral & Maxillofacial Surgery",
    "description": "Specializes in surgical operations of the mouth, jaw and face.",
    "category": "dental",
    "actor": "Oral Surgeon",
    "actors": "Oral Surgeons"
  },
  {
    "uid": "pathologist",
    "name": "Pathology",
    "description": "Specializes in laboratory tests of tissue and bodily fluids.",
    "category": "medical",
    "actor": "Pathologist",
    "actors": "Pathologists"
  },
  {
    "uid": "psychiatry-neurology-sleep-medicine",
    "name": "Psychiatry & Neurology Sleep Medicine",
    "description": "A Psychiatrist or Neurologist who practices Sleep Medicine is certified in the subspecialty of sleep medicine and specializes in the clinical assessment, physiologic testing, diagnosis, management and prevention of sleep and circadian rhythm disorders. Sleep specialists treat patients of any age and use multidisciplinary approaches. Disorders managed by sleep specialists include, but are not limited to, sleep related breathing disorders, insomnia, hypersomnias, circadian rhythm sleep disorders, parasomnias and sleep related movement disorders.",
    "category": "medical",
    "actor": "Psychiatry & Neurology Sleep Medicine",
    "actors": "Psychiatry & Neurology Sleep Medicines"
  },
  {
    "uid": "psychiatry-neurology-vascular-neurology",
    "name": "Psychiatry & Neurology Vascular Neurology",
    "description": "Vascular Neurology is a subspecialty in the evaluation, prevention, treatment and recovery from vascular diseases of the nervous system. This subspecialty includes the diagnosis and treatment of vascular events of arterial or venous origin from a large number of causes that affect the brain or spinal cord such as ischemic stroke, intracranial hemorrhage, spinal cord ischemia and spinal cord hemorrhage.",
    "category": "medical",
    "actor": "Psychiatry & Neurology Vascular Neurology",
    "actors": "Psychiatry & Neurology Vascular Neurologies"
  },
  {
    "uid": "family-medicine-adolescent-medicine",
    "name": "Family Medicine Adolescent Medicine",
    "description": "A family medicine physician with multidisciplinary training in the unique physical, psychological and social characteristics of adolescents and their health care problems and needs.",
    "category": "medical",
    "actor": "Family Medicine Adolescent Medicine",
    "actors": "Family Medicine Adolescent Medicines"
  },
  {
    "uid": "cardiologist",
    "name": "Cardiovascular Disease",
    "description": "Specializes in heart problems.",
    "category": "medical",
    "actor": "Cardiologist",
    "actors": "Cardiologists"
  },
  {
    "uid": "clinical-cytogeneticist",
    "name": "Clinical Cytogenetic",
    "description": "Specializes in laboratory diagnostics of genes.",
    "category": "medical",
    "actor": "Clinical Cytogeneticist",
    "actors": "Clinical Cytogeneticists"
  },
  {
    "uid": "electrophysiology-physical-therapist",
    "name": "Clinical Electrophysiology",
    "description": "Specializes in wound management and physical therapy.",
    "category": "medical",
    "actor": "Electrophysiology Physical Therapist",
    "actors": "Electrophysiology Physical Therapists"
  },
  {
    "uid": "clinical-molecular-geneticist",
    "name": "Clinical Molecular Genetics",
    "description": "Specializes in molecular diagnostics of genetic disorders.",
    "category": "medical",
    "actor": "Clinical Molecular Geneticist",
    "actors": "Clinical Molecular Geneticists"
  },
  {
    "uid": "clinical-exercise-physiologist",
    "name": "Clinical Exercise Physiologist",
    "description": "A Clinical Exercise Physiologist is a health care professional who is trained to work with patients with chronic disease where exercise training has been shown to be of therapeutic benefit, including but not limited to cardiovascular and pulmonary disease, and metabolic disorders.",
    "category": "services",
    "actor": "Clinical Exercise Physiologist",
    "actors": "Clinical Exercise Physiologists"
  },
  {
    "uid": "emergency-medicine-pediatric-emergency-medicine",
    "name": "Emergency Medicine Pediatric Emergency Medicine",
    "description": "Pediatric Emergency Medicine is a clinical subspecialty that focuses on the care of the acutely ill or injured child in the setting of an emergency department.",
    "category": "medical",
    "actor": "Emergency Medicine Pediatric Emergency Medicine",
    "actors": "Emergency Medicine Pediatric Emergency Medicines"
  },
  {
    "uid": "emergency-medicine-doctor",
    "name": "Emergency Medicine",
    "description": "Specializes in immediate emergency care.",
    "category": "medical",
    "actor": "Emergency Medicine Doctor",
    "actors": "Emergency Medicine Doctors"
  },
  {
    "uid": "ergonomic-physical-therapist",
    "name": "Ergonomic Physical Therapy",
    "description": "Specializes in ergonomics and physical therapy.",
    "category": "medical",
    "actor": "Ergonomic Physical Therapist",
    "actors": "Ergonomic Physical Therapists"
  },
  {
    "uid": "pain-medicine-physiatrist",
    "name": "Pain Medicine",
    "description": "Specializes in treating patients with cronic or acute pain.",
    "category": "medical",
    "actor": "Pain Medicine Physiatrist",
    "actors": "Pain Medicine Physiatrists"
  },
  {
    "uid": "pediatric-allergist",
    "name": "Pediatric Allergy",
    "description": "Specializes in treatment of allergies and the immune system in children.",
    "category": "medical",
    "actor": "Pediatric Allergist",
    "actors": "Pediatric Allergists"
  },
  {
    "uid": "pediatric-orhopedic-surgeon",
    "name": "Pediatric Orthopedic Surgery",
    "description": "Specializes in surgery of musculoskeletal problems in children.",
    "category": "medical",
    "actor": "Pediatric Orthopedic Surgeon",
    "actors": "Pediatric Orthopedic Surgeons"
  },
  {
    "uid": "neurology-chiropractor",
    "name": "Chiropractic Neurology",
    "description": "Specializes in alternartive therapy of muscles, bones, and joints.",
    "category": "medical",
    "actor": "Neurology Chiropractor",
    "actors": "Neurology Chiropractors"
  },
  {
    "uid": "pain-medicine-anesthesiologist",
    "name": "Pain Medicine",
    "description": "Specializes in managing acute and chronic pain.",
    "category": "medical",
    "actor": "Pain Medicine Anesthesiologist",
    "actors": "Pain Medicine Anesthesiologists"
  },
  {
    "uid": "pediatric-ear-nose-throat-doctor",
    "name": "Pediatric Otolaryngology",
    "description": "Specializes in children's ear, nose and throat problems.",
    "category": "medical",
    "actor": "Pediatric Ear, Nose and Throat Doctor",
    "actors": "Pediatric Ear, Nose and Throat Doctors"
  },
  {
    "uid": "pediatric-anesthesiologist",
    "name": "Pediatric Anesthesiology",
    "description": "Specializes in managing pain and anesthesia in surgeries of children.",
    "category": "medical",
    "actor": "Pediatric Anesthesiologist",
    "actors": "Pediatric Anesthesiologists"
  },
  {
    "uid": "pathology-clinical-informatics",
    "name": "Pathology Clinical Informatics",
    "description": "Physicians who practice Clinical Informatics collaborate with other health care and information technology professionals to analyze, design, implement and evaluate information and communication systems that enhance individual and population health outcomes, improve patient care, and strengthen the clinician-patient relationship. Clinical Informaticians use their knowledge of patient care combined with their understanding of informatics concepts, methods, and tools to: assess information and knowledge needs of health care professionals and patients; characterize, evaluate, and refine clinical processes; develop, implement, and refine clinical decision support systems; and lead or participate in the procurement, customization, development, implementation, management, evaluation, and continuous improvement of clinical information systems.",
    "category": "medical",
    "actor": "Pathology Clinical Informatic",
    "actors": "Pathology Clinical Informatics"
  },
  {
    "uid": "pediatric-endocrinologist",
    "name": "Pediatric Endocrinology",
    "description": "Specializes in diabetes, thyroid, growth and hormonal disorders in children.",
    "category": "medical",
    "actor": "Pediatric Endocrinologist",
    "actors": "Pediatric Endocrinologists"
  },
  {
    "uid": "pediatric-rehabilitation-physiatrist",
    "name": "Pediatric Rehabilitation Medicine",
    "description": "Specializes in treating children with physical disabilities.",
    "category": "medical",
    "actor": "Pediatric Rehabilitation Physiatrist",
    "actors": "Pediatric Rehabilitation Physiatrists"
  },
  {
    "uid": "pediatrics-clinical-laboratory-immunology",
    "name": "Pediatrics Clinical & Laboratory Immunology",
    "description": "A pediatrician who specializes in clinical and laboratory immunology disease management.",
    "category": "medical",
    "actor": "Pediatrics Clinical & Laboratory Immunology",
    "actors": "Pediatrics Clinical & Laboratory Immunologies"
  },
  {
    "uid": "podiatry-surgeon",
    "name": "Foot & Ankle Surgery",
    "description": "Specializes in foot and ankle surgery.",
    "category": "medical",
    "actor": "Podiatric Surgeon",
    "actors": "Podiatric Surgeons"
  },
  {
    "uid": "prosthodontist",
    "name": "Prosthodontics",
    "description": "Specializes in restoration and replacement of teeth.",
    "category": "dental",
    "actor": "Prosthodontist",
    "actors": "Prosthodontists"
  },
  {
    "uid": "radiological-physicist",
    "name": "Radiological Physics",
    "description": "Specializes in diagnostics via roentgen and gamma rays.",
    "category": "medical",
    "actor": "Radiological Physicist",
    "actors": "Radiological Physicists"
  },
  {
    "uid": "rehabilitation-counselor-assistive-technology-supplier",
    "name": "Rehabilitation Counselor Assistive Technology Supplier",
    "description": "Definition to come...",
    "category": "services",
    "actor": "Rehabilitation Counselor Assistive Technology Supplier",
    "actors": "Rehabilitation Counselor Assistive Technology Suppliers"
  },
  {
    "uid": "psychiatry-neurology-neurodevelopmental-disabilities",
    "name": "Psychiatry & Neurology Neurodevelopmental Disabilities",
    "description": "A pediatrician or neurologist who specializes in the diagnosis and management of chronic conditions that affect the developing and mature nervous system such as cerebral palsy, mental retardation and chronic behavioral syndromes, or neurologic conditions. ",
    "category": "medical",
    "actor": "Psychiatry & Neurology Neurodevelopmental Disability",
    "actors": "Psychiatry & Neurology Neurodevelopmental Disabilities"
  },
  {
    "uid": "respiratory-therapist-certified-home-health",
    "name": "Respiratory Therapist, Certified Home Health",
    "description": "Home care fosters individual responsibility for self-management of chronic respiratory conditions.  It includes individualized assessment based plans of care service developed to promote safe, proper, and sustained use of prescribed respiratory therapy medications, equipment, and techniques in the home.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified Home Health",
    "actors": "Respiratory Therapist, Certified Home Healths"
  },
  {
    "uid": "respiratory-therapist-certified-neonatalpediatrics",
    "name": "Respiratory Therapist, Certified Neonatal/Pediatrics",
    "description": "The care and treatment of premature infants, newborns and children.  This includes management of mechanical ventilation, assessment, diagnostics and generalized respiratory treatments.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified Neonatal/Pediatric",
    "actors": "Respiratory Therapist, Certified Neonatal/Pediatrics"
  },
  {
    "uid": "respiratory-therapist-certified-pulmonary-function-technologist",
    "name": "Respiratory Therapist, Certified Pulmonary Function Technologist",
    "description": "An individual who is trained and qualified to perform pulmonary diagnostic tests.  In the course of conducting these tests, the Pulmonary Function Technologist is able to setup, calibrate, maintain, and ensure the quality assurance of the pulmonary function testing equipment.  In the laboratory, clinical or patient care setting the technologist instructs patients, elicits cooperation, performs procedures, monitors patient response, and evaluates patient performance.  Tests results are calculated, compared with predicted normal ranges, and evaluated for reliability.  The technologist collects clinical history data and evaluates the clinical implications of the test results.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified Pulmonary Function Technologist",
    "actors": "Respiratory Therapist, Certified Pulmonary Function Technologists"
  },
  {
    "uid": "preventive-medicine-clinical-informatics",
    "name": "Preventive Medicine Clinical Informatics",
    "description": "Physicians who practice Clinical Informatics collaborate with other health care and information technology professionals to analyze, design, implement and evaluate information and communication systems that enhance individual and population health outcomes, improve patient care, and strengthen the clinician-patient relationship. Clinical Informaticians use their knowledge of patient care combined with their understanding of informatics concepts, methods, and tools to: assess information and knowledge needs of health care professionals and patients; characterize, evaluate, and refine clinical processes; develop, implement, and refine clinical decision support systems; and lead or participate in the procurement, customization, development, implementation, management, evaluation, and continuous improvement of clinical information systems.",
    "category": "medical",
    "actor": "Preventive Medicine Clinical Informatic",
    "actors": "Preventive Medicine Clinical Informatics"
  },
  {
    "uid": "prosthetist",
    "name": "Prosthetist",
    "description": "A health care professional who is specifically educated and trained to manage comprehensive prosthetic patient care for individuals who have sustained complete or partial limb loss or absence. Prosthetists assess specific patient needs, formulate an appropriate treatment plan, implement the treatment plan and provide follow-up care.",
    "category": "services",
    "actor": "prosthetist",
    "actors": "prosthetists"
  },
  {
    "uid": "psychiatry-neurology-neuromuscular-medicine",
    "name": "Psychiatry & Neurology Neuromuscular Medicine",
    "description": "A neurologist or child neurologist who specializes in the diagnosis and management of disorders of nerve, muscle or neuromuscular junction, including amyotrophic lateral sclerosis, peripheral neuropathies (e.g., diabetic and immune mediated neuropathies), various muscular dystrophies, congenital and acquired myopathies, inflammatory myopathies (e.g., polymyositis, inclusion body myositis) and neuromuscular transmission disorders (e.g., myasthenia gravis, Lambert-Eaton myasthenic syndrome).",
    "category": "medical",
    "actor": "Psychiatry & Neurology Neuromuscular Medicine",
    "actors": "Psychiatry & Neurology Neuromuscular Medicines"
  },
  {
    "uid": "psychiatry-neurology-pain-medicine",
    "name": "Psychiatry & Neurology Pain Medicine",
    "description": "A neurologist, child neurologists or psychiatrist who provides a high level of care, either as a primary physician or consultant, for patients experiencing problems with acute, chronic or cancer pain in both hospital and ambulatory settings. Patient care needs may also be coordinated with other specialists.",
    "category": "medical",
    "actor": "Psychiatry & Neurology Pain Medicine",
    "actors": "Psychiatry & Neurology Pain Medicines"
  },
  {
    "uid": "orthopedic-surgeon",
    "name": "Orthopedic Surgery",
    "description": "Specializes in surgery and treatment of musculoskeletal problems, including knees and spine.",
    "category": "medical",
    "actor": "Orthopedist",
    "actors": "Orthopedists"
  },
  {
    "uid": "orthotic-fitter",
    "name": "Orthotic Fitter",
    "description": "An individual trained in the management of fitting prefabricated orthoses.",
    "category": "services",
    "actor": "Orthotic Fitter",
    "actors": "Orthotic Fitters"
  },
  {
    "uid": "orthopedic-physical-therapist",
    "name": "Orthopedic Physical Therapy",
    "description": "Specializes in physical therapy of joints and muscles.",
    "category": "medical",
    "actor": "Orthopedic Physical Therapist",
    "actors": "Orthopedic Physical Therapists"
  },
  {
    "uid": "pediatric-dentist",
    "name": "Pediatric Dentistry",
    "description": "Specializes in children's oral health.",
    "category": "dental",
    "actor": "Pediatric Dentist",
    "actors": "Pediatric Dentists"
  },
  {
    "uid": "pediatric-urologist",
    "name": "Pediatric Urology",
    "description": "Specializes in children's genital and urinary problems.",
    "category": "medical",
    "actor": "Pediatric Urologist",
    "actors": "Pediatric Urologists"
  },
  {
    "uid": "pediatric-surgeon",
    "name": "Pediatric Surgery",
    "description": "Specializes in complicated surgical conditions in children.",
    "category": "medical",
    "actor": "Pediatric Surgeon",
    "actors": "Pediatric Surgeons"
  },
  {
    "uid": "pediatrics-hospice-and-palliative-medicine",
    "name": "Pediatrics Hospice and Palliative Medicine",
    "description": "A pediatrician with special knowledge and skills to prevent and relieve the suffering experienced by patients with life-limiting illnesses. This specialist works with an interdisciplinary hospice or palliative care team to maximize quality of life while addressing physical, psychological, social and spiritual needs of both patient and family throughout the course of the disease, through the dying process, and beyond for the family.  This specialist has expertise in the assessment of patients with advanced disease; the relief of distressing symptoms; the coordination of interdisciplinary patient and family-centered care in diverse venues; the use of specialized care systems including hospice; the management of the imminently dying patient; and legal and ethical decision making in end-of-life care.",
    "category": "medical",
    "actor": "Pediatrics Hospice and Palliative Medicine",
    "actors": "Pediatrics Hospice and Palliative Medicines"
  },
  {
    "uid": "pediatrics-medical-toxicology",
    "name": "Pediatrics Medical Toxicology",
    "description": "Medical toxicologists are physicians that specialize in the prevention, evaluation, treatment and monitoring of injury and illness from exposures to drugs and chemicals, as well as biological and radiological agents. Medical toxicologists care for people in clinical, academic, governmental and public health settings, and provide poison control center leadership. Important areas of medical toxicology include acute drug poisoning, adverse drug events, drug abuse, addiction and withdrawal, chemicals and hazardous materials, terrorism preparedness, venomous bites and stings, and environmental and workplace exposures.",
    "category": "medical",
    "actor": "Pediatrics Medical Toxicology",
    "actors": "Pediatrics Medical Toxicologies"
  },
  {
    "uid": "physical-therapy-assistant",
    "name": "Physical Therapy Assistant",
    "description": "(1)Physical therapist assistants are skilled health care providers who are graduates of a physical therapist assistant associate degree program accredited by an agency recognized by the Secretary of the U.S. Department of Education or Council on Postsecondary Accreditation, who assists the physical therapist in providing physical therapy. The supervising physical therapist is directly responsible for the actions of the physical therapist assistant. The PTA performs physical therapy procedures and related tasks that have been selected and delegated by the supervising physical therapist. Duties of the PTA include assisting the physical therapist in implementing treatment programs, training patients in exercised and activities of daily living, conducting treatments, and reporting to the physical therapist on the patient's responses. In addition to direct patient care, the PTA may also perform such functions as patient transport, and clinic or equipment preparation and maintenance. Currently more than half of all states require PTAs to be licensed, registered or certified. (2) An individual who works under the supervision of a physical therapist to assist him or her in providing physical therapy services. A physical therapy assistant may, for instance, help patients follow an appropriate exercise program that will increase their strength, endurance, coordination, and range of motion and train patients to perform activities of daily life.",
    "category": "therapy",
    "actor": "Physical Therapy Assistant",
    "actors": "Physical Therapy Assistants"
  },
  {
    "uid": "plastic-surgeon",
    "name": "Plastic and Reconstructive Surgery",
    "description": "Specializes in plastic and reconstructive surgery.",
    "category": "medical",
    "actor": "Plastic Surgeon",
    "actors": "Plastic Surgeons"
  },
  {
    "uid": "pulmonologist",
    "name": "Pulmonary Disease",
    "description": "Specializes in lungs and airways.",
    "category": "medical",
    "actor": "Pulmonologist",
    "actors": "Pulmonologists"
  },
  {
    "uid": "rehabilitation-counselor-assistive-technology-practitioner",
    "name": "Rehabilitation Counselor Assistive Technology Practitioner",
    "description": "Definition to come...",
    "category": "therapy",
    "actor": "Rehabilitation Counselor Assistive Technology Practitioner",
    "actors": "Rehabilitation Counselor Assistive Technology Practitioners"
  },
  {
    "uid": "reproductive-erndocrinologist",
    "name": "Reproductive Endocrinology",
    "description": "Specializes in infertility and hormonal problems.",
    "category": "medical",
    "actor": "Reproductive Endocrinologist",
    "actors": "Reproductive Endocrinologists"
  },
  {
    "uid": "respiratory-therapist-registered-geriatric-care",
    "name": "Respiratory Therapist, Registered Geriatric Care",
    "description": "Care of older patients who have age and/or disease related decremental pulmonary changes.  Diagnosis and treatment is very important for this group since chronic lung disease is the major cause of morbidity and mortality among them.  Furthermore, as this segment of the population increases, life expectancy is being extended.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered Geriatric Care",
    "actors": "Respiratory Therapist, Registered Geriatric Cares"
  },
  {
    "uid": "respiratory-therapist-registered-neonatalpediatrics",
    "name": "Respiratory Therapist, Registered Neonatal/Pediatrics",
    "description": "The care and treatment of premature infants, newborns and children.  This includes management of mechanical ventilation, assessment, diagnostics and generalized respiratory treatments.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered Neonatal/Pediatric",
    "actors": "Respiratory Therapist, Registered Neonatal/Pediatrics"
  },
  {
    "uid": "respiratory-therapist-registered-pulmonary-function-technologist",
    "name": "Respiratory Therapist, Registered Pulmonary Function Technologist",
    "description": "An individual who is trained and qualified to perform pulmonary diagnostic tests.  In the course of conducting these tests, the Pulmonary Function Technologist is able to setup, calibrate, maintain, and ensure the quality assurance of the pulmonary function testing equipment.  In the laboratory, clinical or patient care setting the technologist instructs patients, elicits cooperation, performs procedures, monitors patient response, and evaluates patient performance.  Tests results are calculated, compared with predicted normal ranges, and evaluated for reliability.  The technologist collects clinical history data and evaluates the clinical implications of the test results.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered Pulmonary Function Technologist",
    "actors": "Respiratory Therapist, Registered Pulmonary Function Technologists"
  },
  {
    "uid": "respiratory-therapist-certified-palliativehospice",
    "name": "Respiratory Therapist, Certified Palliative/Hospice",
    "description": "A coordinated plan of care to help dying patients and their families handle the burden of terminal care.  Effective secretion management and relief of dyspnea are paramount in caring for patients with end-stage pulmonary disease.",
    "category": "medical",
    "actor": "Respiratory Therapist, Certified Palliative/Hospice",
    "actors": "Respiratory Therapist, Certified Palliative/Hospices"
  },
  {
    "uid": "respiratory-therapist-certified-pulmonary-rehabilitation",
    "name": "Respiratory Therapist, Certified Pulmonary Rehabilitation",
    "description": "The respiratory therapist can assist the chronic pulmonary patient in returning to an optimal role in society by providing an effective program.  It includes bronchopulmonary drainage, exercise therapy, and patient education.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified Pulmonary Rehabilitation",
    "actors": "Respiratory Therapist, Certified Pulmonary Rehabilitations"
  },
  {
    "uid": "respiratory-therapist-registered",
    "name": "Respiratory Therapist, Registered",
    "description": "A Registered Respiratory Therapist (RRT) is an advanced therapist who has passed standardized written and clinical simulation examinations administered by the National Board for Respiratory Care (NBRC).  In addition, to the certified therapist (CRT) entry level skills, RRTs have advanced education and training in patient assessment, in the development and modification of patient care plans, and in assuring the appropriate utilization of respiratory care resources.  An RRT is a graduate of an associate or baccalaureate degree producing educational programs approved by the Commission on Accreditation of Allied Health Education Programs (CAAHEP) and where applicable, is licensed by the state and is practicing within the scope of that license.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Registered",
    "actors": "Respiratory Therapist, Registereds"
  },
  {
    "uid": "respiratory-therapist-certified-emergency-care",
    "name": "Respiratory Therapist, Certified Emergency Care",
    "description": "The immediate availability of diagnostic and therapeutic cardiopulmonary services in the assessment and management of trauma victims, patients requiring airway management and others requiring emergency care.",
    "category": "therapy",
    "actor": "Respiratory Therapist, Certified Emergency Care",
    "actors": "Respiratory Therapist, Certified Emergency Cares"
  },
  {
    "uid": "sleep-medicine-otolaryngologist",
    "name": "Otolaryngologic Sleep Medicine",
    "description": "Specializes in sleep disorders.",
    "category": "medical",
    "actor": "Sleep Medicine Otolaryngologist",
    "actors": "Sleep Medicine Otolaryngologists"
  },
  {
    "uid": "techniciantechnologist-orthoptist",
    "name": "Technician/Technologist Orthoptist",
    "description": "Definition to come...",
    "category": "vision",
    "actor": "Technician/Technologist Orthoptist",
    "actors": "Technician/Technologist Orthoptists"
  },
  {
    "uid": "thermography-chiropractor",
    "name": "Chiropractic Thermography",
    "description": "Specializes in alternartive therapy of muscles, bones, and joints.",
    "category": "medical",
    "actor": "Thermography Chiropractor",
    "actors": "Thermography Chiropractors"
  },
  {
    "uid": "surgery-surgery-of-the-hand",
    "name": "Surgery of the Hand",
    "description": "A surgeon with expertise in the investigation, preservation and restoration by medical, surgical and rehabilitative means, of all structures of the upper extremity directly affecting the form and function of the hand and wrist.",
    "category": "medical",
    "actor": "Surgery of the Hand",
    "actors": "Surgery of the Hands"
  },
  {
    "uid": "techniciantechnologist",
    "name": "Technician/Technologist",
    "description": "A broad category grouping different kinds of technologists and technicians. See individual definitions.",
    "category": "dental",
    "actor": "Technician/Technologist",
    "actors": "Technician/Technologists"
  },
  {
    "uid": "specialisttechnologist-rehabilitation-blind",
    "name": "Specialist/Technologist Rehabilitation, Blind",
    "description": "Definition to come...",
    "category": "therapy",
    "actor": "Specialist/Technologist Rehabilitation, Blind",
    "actors": "Specialist/Technologist Rehabilitation, Blinds"
  },
  {
    "uid": "sport-medicine-pediatrician",
    "name": "Pediatric Sport Medicine",
    "description": "Specializes in the prevention and treatment of sports injuries in children.",
    "category": "medical",
    "actor": "Sport Medicine Pediatrician",
    "actors": "Sport Medicine Pediatricians"
  },
  {
    "uid": "sports-medicine-physiatrist",
    "name": "Physiastric Sports Medicine",
    "description": "Specializes in treating patients with sport related physical disabilities.",
    "category": "medical",
    "actor": "Sports Medicine Physiatrist",
    "actors": "Sports Medicine Physiatrists"
  },
  {
    "uid": "sports-podiatrist",
    "name": "Sports Medicine Podiatry",
    "description": "Specializes in sport related foot and ankle problems.",
    "category": "medical",
    "actor": "Sports Podiatrist",
    "actors": "Sports Podiatrists"
  },
  {
    "uid": "sports-medicine-doctor",
    "name": "Sports Medicine",
    "description": "Specializes in prevention and treatment of sports related injuries.",
    "category": "medical",
    "actor": "Sports Medicine Doctor",
    "actors": "Sports Medicine Doctors"
  },
  {
    "uid": "sleep-medicine-pediatrician",
    "name": "Pediatric Sleep Medicine",
    "description": "Specializes in children's sleep disorders.",
    "category": "medical",
    "actor": "Sleep Medicine Pediatrician",
    "actors": "Sleep Medicine Pediatricians"
  },
  {
    "uid": "transplant-hepatologist",
    "name": "Transplant Hepatology",
    "description": "Specializes in liver transplants.",
    "category": "medical",
    "actor": "Transplant Hepatologist",
    "actors": "Transplant Hepatologists"
  },
  {
    "uid": "addiction-counselor",
    "name": "Addiction Counseling",
    "description": "Specializes in addiction counseling.",
    "category": "medical",
    "actor": "Addiction Counselor",
    "actors": "Addiction Counselors"
  },
  {
    "uid": "addiction-specialist",
    "name": "Addiction Medicine",
    "description": "Specializes in the treatment of addiction disorders.",
    "category": "medical",
    "actor": "Addiction Specialist",
    "actors": "Addiction Specialists"
  },
  {
    "uid": "adult-nurse-practitioner",
    "name": "Adult Health Nurse Practitioner",
    "description": "Specializes in adult's health.",
    "category": "medical",
    "actor": "Adult Nurse Practitoner",
    "actors": "Adult Nurse Practitoners"
  },
  {
    "uid": "advanced-practice-dental-therapist",
    "name": "Advanced Practice Dental Therapist",
    "description": "An Advanced Practice Dental Therapist is:<br/>(1) A dental therapist who has completed additional training beyond basic dental therapy education and provides dental services in accordance with state advanced practice dental therapist laws or statutes; or<br/>(2) A dental hygienist with a graduate degree in advanced dental therapy prepared for independent and interdependent decision making and direct accountability for clinical judgment across the dental health care continuum.<br/><br/>The individual has been authorized by the relevant state board or a tribal entity to provide services under the remote supervision of a dentist. The functions of the advanced practice dental therapist vary based on the needs of the dentist, the educational preparation of the advanced practice dental therapist and state dental practice acts and regulations.",
    "category": "dental",
    "actor": "Advanced Dental Therapist(ADT)",
    "actors": "Advanced Dental Therapist(ADT)S"
  },
  {
    "uid": "adult-psychologist",
    "name": "Adult Development & Aging Psychology",
    "description": "Specializes in adult counceling and therapy.",
    "category": "medical",
    "actor": "Adult Psychologist",
    "actors": "Adult Psychologists"
  },
  {
    "uid": "chemical-pathologist",
    "name": "Chemical Pathology",
    "description": "Specializes in biochemistry of the human body.",
    "category": "medical",
    "actor": "Chemical Pathologist",
    "actors": "Chemical Pathologists"
  },
  {
    "uid": "clinical-child-psychologist",
    "name": "Clinical Child & Adolescent Psychology",
    "description": "Specializes in children's psychological counceling and therapy.",
    "category": "medical",
    "actor": "Clinical Child Psychologist",
    "actors": "Clinical Child Psychologists"
  },
  {
    "uid": "chiropractor",
    "name": "Chiropractics",
    "description": "Specializes in alternartive therapy of muscles, bones, and joints.",
    "category": "medical",
    "actor": "Chiropractor",
    "actors": "Chiropractors"
  },
  {
    "uid": "dance-therapist",
    "name": "Dance Therapist",
    "description": "The dance therapist, sometimes called a movement therapist, focuses on rhythmic body movements as a medium of physical and psychological change. Dance therapy is practiced more often with mental health patients than with physically disabled patients. A master's degree is required by the American Dance Therapy Association to award the credentials Dance Therapist Registered (DTR).",
    "category": "therapy",
    "actor": "Dance Therapist",
    "actors": "Dance Therapists"
  },
  {
    "uid": "bariatric-medicine-obgyn",
    "name": "Bariatric Medicine OBGYN",
    "description": "Specializes in the treatment of obesity and its associated conditions.",
    "category": "medical",
    "actor": "Bariatric Medicine OBGYN",
    "actors": "Bariatric Medicine OBGYNS"
  },
  {
    "uid": "assistant-podiatric",
    "name": "Assistant, Podiatric",
    "description": "An individual who assists a podiatrist in tasks, such as exposing and developing x-rays; taking and recording patient histories; assisting in biomechanical evaluations and negative castings; preparing and sterilizing instruments and equipment; providing the patient with postoperative instructions; applying surgical dressings; preparing the patient for treatment, padding, and strapping; and performing routine office procedures.",
    "category": "medical",
    "actor": "Assistant, Podiatric",
    "actors": "Assistant, Podiatrics"
  },
  {
    "uid": "audiologist",
    "name": "Audiology",
    "description": "Specializes in hearing and hearing aids.",
    "category": "medical",
    "actor": "Audiologist",
    "actors": "Audiologists"
  },
  {
    "uid": "hospice-palliative-obgyn",
    "name": "Hospice & Palliative Medicine",
    "description": "Specializes in preventing and relieving life limiting illnesses",
    "category": "medical",
    "actor": "Hospice and Palliative OBGYN",
    "actors": "Hospice and Palliative OBGYNS"
  },
  {
    "uid": "infectious-disease-doctor",
    "name": "Infectious Disease",
    "description": "Specializes in infectious diseases of all types and in all organ systems.",
    "category": "medical",
    "actor": "Infectious Disease Doctor",
    "actors": "Infectious Disease Doctors"
  },
  {
    "uid": "infectious-diseases-pediatrician",
    "name": "Pediatric Infectious Disease",
    "description": "Specializes in children's infectious diseases.",
    "category": "medical",
    "actor": "Infectious Disease Pediatrician",
    "actors": "Infectious Disease Pediatricians"
  },
  {
    "uid": "general-dentist",
    "name": "General Dentistry",
    "description": "Specializes in teeth and oral health.",
    "category": "dental",
    "actor": "Dentist",
    "actors": "Dentists"
  },
  {
    "uid": "gerontology-nurse-practitioner",
    "name": "Gerontology Nurse Practitioner",
    "description": "Specializes in the diagnosis of common illnesses.",
    "category": "medical",
    "actor": "Gerontology Nurse Practitoner",
    "actors": "Gerontology Nurse Practitoners"
  },
  {
    "uid": "geriatric-medicine-doctor",
    "name": "Geriatric Medicine",
    "description": "Specializes in the aging process and elderly.",
    "category": "medical",
    "actor": "Geriatric Medicine Doctor",
    "actors": "Geriatric Medicine Doctors"
  },
  {
    "uid": "gynecologic-oncologist",
    "name": "Gynecologic Oncology",
    "description": "Specializes in cancer and other tumors of the female reproductive organs.",
    "category": "medical",
    "actor": "Gynecologic Oncologist",
    "actors": "Gynecologic Oncologists"
  },
  {
    "uid": "electrodiagnostic-medicine",
    "name": "Electrodiagnostic Medicine",
    "description": "Electrodiagnostic medicine is the medical subspecialty that applies neurophysiologic techniques to diagnose, evaluate, and treat patients with impairments of the neurologic, neuromuscular, and/or muscular systems.  Qualified physicians are trained in performing electrophysiological testing and interpretation of the test data.  They require knowledge in anatomy, physiology, kinesiology, histology, and pathology of the brain, spinal cord, autonomic nerves, cranial nerves, peripheral nerves, neuromuscular junction, and muscles. They must know clinical features and treatment of diseases of the central, peripheral, and autonomic nervous systems, as well as those of neuromuscular junction and muscle. Physicians also require special knowledge about electric signal processing, including waveform analysis, electronics and instrumentation, stimulation and recording equipment, and statistics.",
    "category": "medical",
    "actor": "Electrodiagnostic Physician",
    "actors": "Electrodiagnostic Physicians"
  },
  {
    "uid": "forensic-pathologist",
    "name": "Forensic Pathology",
    "description": "Specializes in investigating reasons of death.",
    "category": "medical",
    "actor": "Forensic Pathologist",
    "actors": "Forensic Pathologists"
  },
  {
    "uid": "hematopathologist",
    "name": "Hematology",
    "description": "Specializes in laboratory tests of blood cells and bone marrow.",
    "category": "medical",
    "actor": "Hematopathologist",
    "actors": "Hematopathologists"
  },
  {
    "uid": "hand-orthopedist",
    "name": "Hand Surgery",
    "description": "Specializes in hand and wrist surgery.",
    "category": "medical",
    "actor": "Hand Surgeon",
    "actors": "Hand Surgeons"
  },
  {
    "uid": "hepatologist",
    "name": "Hepatology",
    "description": "Specializes in liver and spleen  diseases.",
    "category": "medical",
    "actor": "Hepatologist",
    "actors": "Hepatologists"
  },
  {
    "uid": "occupational-therapist-low-vision",
    "name": "Occupational Therapist Low Vision",
    "description": "Occupational therapists enable children and adults with visual impairment to engage in their chosen daily living activities safely and as independently as possible.  This is accomplished by 1) teaching the person to use their remaining vision as efficiently as possible to complete activities; (2) modifying activities so that they can be completed with less vision; (3) training the person in use of adaptive equipment to compensate for vision loss, including high and low technology assistive devices; and (4) modifying the person's environment.",
    "category": "therapy",
    "actor": "Occupational Therapist Low Vision",
    "actors": "Occupational Therapist Low Visions"
  },
  {
    "uid": "occupational-therapist-mental-health",
    "name": "Occupational Therapist Mental Health",
    "description": "Occupational therapists provide treatment for people recovering from a mental or physical illness to regain their independence and stability and to engage in normal daily occupations (work, home, family life, school, leisure).  Occupational therapists provide particular emphasis on interventions that result in improved quality of life and decrease hospitalization.",
    "category": "therapy",
    "actor": "Occupational Therapist Mental Health",
    "actors": "Occupational Therapist Mental Healths"
  },
  {
    "uid": "occupational-therapist-pediatrics",
    "name": "Occupational Therapist Pediatrics",
    "description": "Occupational therapists provide services to infants, toddlers and children who have or who are at risk for developmental delays or disabilities. Occupational therapy is concerned with a child's ability to participate in daily life activities or \"occupations.\"  Occupational therapists use their unique expertise to help children with social-emotional, physical, cognitive, communication, and adaptive behavioral challenges and to help children to be prepared for and perform important learning and school-related activities and to fulfill their rule as students.  Through an understanding of the impact of disability, illness, and impairment on a child's development, plan, ability to learn new skills, and overall occupational performance, occupational therapists design interventions that promote healthy development, establish needed skills, and/or modify environments, all in support of participation in daily activities.",
    "category": "therapy",
    "actor": "Occupational Therapist Pediatric",
    "actors": "Occupational Therapist Pediatrics"
  },
  {
    "uid": "internal-medicine-clinical-cardiac-electrophysiology",
    "name": "Internal Medicine Clinical Cardiac Electrophysiology",
    "description": "A field of special interest within the subspecialty of cardiovascular disease, specialty of Internal Medicine, which involves intricate technical procedures to evaluate heart rhythms and determine appropriate treatment for them.",
    "category": "medical",
    "actor": "Internal Medicine Clinical Cardiac Electrophysiology",
    "actors": "Internal Medicine Clinical Cardiac Electrophysiologies"
  },
  {
    "uid": "internal-medicine-hematology",
    "name": "Internal Medicine Hematology",
    "description": "An internist with additional training who specializes in diseases of the blood, spleen and lymph. This specialist treats conditions such as anemia, clotting disorders, sickle cell disease, hemophilia, leukemia and lymphoma.",
    "category": "medical",
    "actor": "Hematologist",
    "actors": "Hematologists"
  },
  {
    "uid": "internal-medicine-hypertension-specialist",
    "name": "Internal Medicine Hypertension Specialist",
    "description": "A Hypertension Specialist is a physician who concentrates on all aspects of the diagnosis and treatment of hypertension.",
    "category": "medical",
    "actor": "Internal Medicine Hypertension Specialist",
    "actors": "Internal Medicine Hypertension Specialists"
  },
  {
    "uid": "kinesiotherapist",
    "name": "Kinesiotherapist",
    "description": "A provider trained and educated in the applied science of medically prescribed therapeutic exercise, education and adapted physical activities designed to improve the quality of line and health of adults and children by developing physical fitness, increasing mobility and independence, and improving psychosocial behavior. The kinesiotherapist seeks a coach-player relationship in which he/she helps the patient/client reach the goal of becoming an independent, self-sustaining person. Kinesiotherapists, as compared with physical therapists, put more emphasis on geriatric care, reconditioning and fitness, and psychiatric care. A large percentage of kinesiotherapists practice in Veterans Administration hospitals.",
    "category": "therapy",
    "actor": "Kinesiotherapist",
    "actors": "Kinesiotherapists"
  },
  {
    "uid": "obgyn-nurse-practitioner",
    "name": "OBGYN Nurse Practitioner",
    "description": "Specializes in the care of the female reproductive system.",
    "category": "medical",
    "actor": "OBGYN Nurse Practitoner",
    "actors": "OBGYN Nurse Practitoners"
  },
  {
    "uid": "occupational-chiropractor",
    "name": "Chiropractic Occupational Health",
    "description": "Specializes in alternartive therapy of muscles, bones, and joints.",
    "category": "medical",
    "actor": "Occupational Chiropractor",
    "actors": "Occupational Chiropractors"
  },
  {
    "uid": "occupational-therapist-driving-and-community-mobility",
    "name": "Occupational Therapist Driving and Community Mobility",
    "description": "Occupational therapists can optimize and prolong an older driver's ability to drive safely and ease the transition to other forms of transportation if driving cessation becomes necessary.  By identifying strengths as well as physical or cognitive challenges, occupational therapists can evaluate an individual's overall ability to operate a vehicle safely and recommend assistive devices or behavioral changes to limit risks.  Occupational therapy practitioners offer a continuum of services related to community mobility, from evaluation of driving performance, through counseling and support for lifestyle changes, to maintaining independence and quality of life.",
    "category": "therapy",
    "actor": "Occupational Therapist Driving and Community Mobility",
    "actors": "Occupational Therapist Driving and Community Mobilities"
  },
  {
    "uid": "molecular-genetic-pathologist",
    "name": "Molecular Genetic Pathology",
    "description": "Specializes in laboratory tests of genetic materials.",
    "category": "medical",
    "actor": "Molecular Genetic Pathologist",
    "actors": "Molecular Genetic Pathologists"
  },
  {
    "uid": "neonatal-perinatal-pediatrician",
    "name": "Neonatal & Perinatal Medicine",
    "description": "Specializes in premature and ill new borns as well as high-risk pregnancies.",
    "category": "medical",
    "actor": "Neonatal & Perinatal Pediatrician",
    "actors": "Neonatal & Perinatal Pediatricians"
  },
  {
    "uid": "neonatal-nurse-practitioner",
    "name": "Neonatology Nurse Practitioner",
    "description": "Specializes in premature and ill new borns as well as high-risk pregnancies.",
    "category": "medical",
    "actor": "Neonatal Nurse Practitoner",
    "actors": "Neonatal Nurse Practitoners"
  },
  {
    "uid": "neuromusculoskeletal-medicine-sports-medicine",
    "name": "Neuromusculoskeletal Medicine, Sports Medicine",
    "description": "Definition to come.",
    "category": "medical",
    "actor": "Neuromusculoskeletal Medicine, Sports Medicine",
    "actors": "Neuromusculoskeletal Medicine, Sports Medicines"
  },
  {
    "uid": "naturopathic-doctor",
    "name": "Naturopath",
    "description": "Specializes in alternative natural healing.",
    "category": "medical",
    "actor": "Naturopathic Doctor",
    "actors": "Naturopathic Doctors"
  },
  {
    "uid": "mental-retardation-psychologists",
    "name": "Mental Retardation & Developmental Disabilities",
    "description": "Specializes in the counceling and therapy of the mentally challenged.",
    "category": "medical",
    "actor": "Mental Retardation Psychologist",
    "actors": "Mental Retardation Psychologists"
  },
  {
    "uid": "obstetrician",
    "name": "Obstetrics",
    "description": "Specializes in pregnancy and delivery.",
    "category": "medical",
    "actor": "Obstetrician",
    "actors": "Obstetricians"
  },
  {
    "uid": "nutrition-chiropractor",
    "name": "Chiropractic Nutrition Medicine",
    "description": "Specializes in alternartive therapy of muscles, bones, and joints.",
    "category": "medical",
    "actor": "Nutrition Chiropractor",
    "actors": "Nutrition Chiropractors"
  },
  {
    "uid": "occupational-vision-optometrist",
    "name": "Occupational Vision",
    "description": "Specializes in work related vision and eye safety.",
    "category": "vision",
    "actor": "Occupational Vision Optometrist",
    "actors": "Occupational Vision Optometrists"
  },
  {
    "uid": "psychiatry-neurology-sports-medicine",
    "name": "Psychiatry & Neurology Sports Medicine",
    "description": "A psychiatrist or neurologist who specializes in the diagnosis and treatment of sports related conditions and injuries.",
    "category": "medical",
    "actor": "Psychiatry & Neurology Sports Medicine",
    "actors": "Psychiatry & Neurology Sports Medicines"
  },
  {
    "uid": "medical-geneticist",
    "name": "Ph.D. Medical Genetics",
    "description": "Specializes in the diagnoses of and counselling for genetic disorders.",
    "category": "medical",
    "actor": "Geneticist",
    "actors": "Geneticists"
  },
  {
    "uid": "medical-psychologist",
    "name": "Prescribing (Medical) Psychology",
    "description": "Specializes in treating the mind with medication.",
    "category": "medical",
    "actor": "Medical Psychologist",
    "actors": "Medical Psychologists"
  },
  {
    "uid": "vascular-interventional-radiologist",
    "name": "Vascular & Interventional Radiology",
    "description": "Specializes in diagnosing diseases by imaging.",
    "category": "medical",
    "actor": "Vascular & Interventional Radiologist",
    "actors": "Vascular & Interventional Radiologists"
  },
  {
    "uid": "vascular-surgeon",
    "name": "Vascular Surgery",
    "description": "Specializes in blood vessel surgery excluding the heart.",
    "category": "medical",
    "actor": "Vascular Surgeon",
    "actors": "Vascular Surgeons"
  },
  {
    "uid": "clinical-neurophysiologist",
    "name": "Clinical Neurophysiology",
    "description": "Specializes in nervous system disorders.",
    "category": "medical",
    "actor": "Clinical Neurophysiologist",
    "actors": "Clinical Neurophysiologists"
  },
  {
    "uid": "women-health-nurse-practitioner",
    "name": "Women's Health Nurse Practitioner",
    "description": "Specializes in women's health.",
    "category": "medical",
    "actor": "Women's Health Nurse Practitoner",
    "actors": "Women's Health Nurse Practitoners"
  },
  {
    "uid": "emergency-medicine-emergency-medical-services",
    "name": "Emergency Medicine Emergency Medical Services",
    "description": "An emergency medicine physician who specializes in non-hospital based emergency medical services (e.g., disaster site, accident scene, transport vehicle, etc.) to provide pre-hospital assessment, treatment, and transport patients.",
    "category": "medical",
    "actor": "Emergency Medicine Emergency Medical Service",
    "actors": "Emergency Medicine Emergency Medical Services"
  },
  {
    "uid": "child-abuse-pediatrician",
    "name": "Child Abuse Pediatrics",
    "description": "Specializes in treating consequences of child abuse and neglect.",
    "category": "medical",
    "actor": "Child Abuse Pediatricians",
    "actors": "Child Abuse Pediatricians"
  },
  {
    "uid": "clinical-biochemical-geneticist",
    "name": "Clinical Biochemical Genetics",
    "description": "Specializes in biochemical diagnostics of genetic disorders.",
    "category": "medical",
    "actor": "Clinical Biochemical Geneticist",
    "actors": "Clinical Biochemical Geneticists"
  },
  {
    "uid": "emergency-medicine-sports-medicine",
    "name": "Emergency Medicine Sports Medicine",
    "description": "An emergency physician with special knowledge in sports medicine is responsible for continuous care in the field of sports medicine, not only for the enhancement of health and fitness, but also for the prevention and management of injury and illness. A sports medicine physician has knowledge and experience in the promotion of wellness and the role of exercise in promoting a healthy lifestyle. Knowledge of exercise physiology, biomechanics, nutrition, psychology, physical rehabilitation and epidemiology is essential to the practice of sports medicine.",
    "category": "medical",
    "actor": "Emergency Medicine Sports Medicine",
    "actors": "Emergency Medicine Sports Medicines"
  },
  {
    "uid": "clinical-geneticist",
    "name": "Clinical Genetics (M.D.)",
    "description": "Specializes in the diagnoses of and counselling for genetic disorders.",
    "category": "medical",
    "actor": "Geneticist",
    "actors": "Geneticists"
  },
  {
    "uid": "emergency-medicine-undersea-and-hyperbaric-medicine",
    "name": "Emergency Medicine Undersea and Hyperbaric Medicine",
    "description": "A specialist who treats decompression illness and diving accident cases and uses hyperbaric oxygen therapy to treat such conditions as carbon monoxide poisoning, gas gangrene, non-healing wounds, tissue damage from radiation and burns, and bone infections.  This specialist also serves as a consultant to other physicians in all aspects of hyperbaric chamber operations, and assesses risks and applies appropriate standards to prevent disease and disability in divers and other persons working in altered atmospheric conditions.",
    "category": "medical",
    "actor": "Emergency Medicine Undersea and Hyperbaric Medicine",
    "actors": "Emergency Medicine Undersea and Hyperbaric Medicines"
  },
  {
    "uid": "family-medicine-addiction-medicine",
    "name": "Family Medicine Addiction Medicine",
    "description": "A family medicine physician who specializes in the diagnosis and treatment of addictions.",
    "category": "medical",
    "actor": "Family Medicine Addiction Medicine",
    "actors": "Family Medicine Addiction Medicines"
  },
  {
    "uid": "family-medicine-adult-medicine",
    "name": "Family Medicine Adult Medicine",
    "description": "Definition to come.",
    "category": "medical",
    "actor": "Family Medicine Adult Medicine",
    "actors": "Family Medicine Adult Medicines"
  }
]

export {
  checkStatus,
  API_HEADER,
  checkResponse,
  extractJSON,
  headers,
  isIE11,
  specialties
};