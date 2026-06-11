import React from 'react';
import { ScrollText, ShieldCheck, Info, FileCheck, User } from 'lucide-react';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
    return (
        <div className="terms-wrapper py-5">
            <div className="container">
                <div className="terms-card mx-auto shadow-lg">
                    <div className="terms-header text-center py-5">
                        <div className="icon-badge mb-3">
                            <ScrollText size={32} />
                        </div>
                        <h1>Terms & Conditions</h1>
                        <p className="text-muted">Last updated: June 2024</p>
                    </div>

                    <div className="terms-body px-4 px-md-5 pb-5">
                        <section className="terms-section mb-5">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <ShieldCheck className="text-primary" size={20} />
                                <h4 className="mb-0">1. कंपनी विशिष्टता (Company Exclusivity)</h4>
                            </div>
                            <p>
                                SOS पार्टनर कंपनी के अलावा यदि वह दूसरी रियल एस्टेट कंपनी में कार्य करता हुआ पाया गया, 
                                तो उस पार्टनर के उस दिनांक तक स्वयं के बिजनेस के कमीशन का 50% प्रति स्क्वायर फीट भुगतान किया जाएगा 
                                एवं उससे प्राप्त लाभ जिससे टीम के द्वारा दिए गए बिजनेस एवं उस पार्टनर को टीम तत्काल प्रभाव से शून्य मानी जाएगी।
                            </p>
                        </section>

                        <section className="terms-section mb-5">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <ShieldCheck className="text-primary" size={20} />
                                <h4 className="mb-0">2. नेटवर्क मार्केटिंग प्रतिबंध (Network Marketing Restriction)</h4>
                            </div>
                            <p>
                                SOS पार्टनर कंपनी के किसी भी SOS पार्टनर के कोई नेटवर्क मार्केटिंग कंपनी के बारे में उसका कार्य करता हुआ पाया गया, 
                                तो वह पार्टनर की आईडी कंपनी के द्वारा तत्काल प्रभाव से ब्लॉक कर दी जाएगी।
                            </p>
                        </section>

                        <section className="terms-section mb-5">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <User className="text-primary" size={20} />
                                <h4 className="mb-0">3. कार्यालय अनुशासन (Office Decorum)</h4>
                            </div>
                            <p>
                                SOS पार्टनर को कंपनी के ऑफिस में परफॉर्मेंस ड्रेस, आईडी कार्ड एवं टाई में ही आना है।
                            </p>
                        </section>

                        <section className="terms-section mb-5">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <FileCheck className="text-primary" size={20} />
                                <h4 className="mb-0">4. क्लाइंट विज़िट और बुकिंग (Client Visit & Booking)</h4>
                            </div>
                            <p>
                                यदि किसी SOS पार्टनर द्वारा किसी Client की Visit कराई जाती है और वह Partner अगले 45 दिनों तक Client के Contact में रहता है, 
                                तो इस अवधि में होने वाली Booking का लाभ उसी Partner को मिलेगा।
                            </p>
                            <p className="mt-2">
                                यदि 45 दिनों के बाद Partner Client के Contact में नहीं रहता है और किसी अन्य SOS Partner द्वारा उसी Client की पुनः Visit या Booking कराई जाती है, 
                                तो उस Booking का लाभ दूसरे Partner को मान्य होगा।
                            </p>
                        </section>

                        <div className="terms-footer text-center pt-4 border-top">
                            <p className="small text-muted mb-0">
                                © 2024 SOS Infrabulls - Mahanta Group. All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
