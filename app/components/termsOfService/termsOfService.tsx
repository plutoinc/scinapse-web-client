import * as React from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import ImprovedFooter from '../layouts/improvedFooter';
const styles = require('./termsOfService.scss');

@withStyles<typeof TermsOfService>(styles)
class TermsOfService extends React.Component {
  public render() {
    return (
      <div className={styles.rootWrapper}>
        <div className={styles.termsOfServiceContainer}>
          <div className={styles.title}>Pluto Inc. TERMS OF SERVICE</div>
          <p className={styles.contents}>
            Pluto Inc. craves to make a world where there is no barrier in academia. Specifically, we want to build a
            better ecosystem where those who pursue science and research are promoted to collaborate with rather than
            competing each other.Pluto Inc. ("Pluto Inc.", "we", "our", "ours", or "us") is a non-profit team based in
            Seoul, Republic of Korea (South Korea), whose mission is to empower and engage researchers around the world
            to share and develop scientific knowledge in a collaborative, fair, and transparent environment for the
            prosperity of knowledge of humanity. For the dynamic community of researchers to better engage with each
            other in the designated manners, we provide the necessary infrastructures and frameworks for generating and
            sharing information relevant to research and many other activities that support this mission. We put in
            every effort to build an ecosystem where knowledge pieces in science and research are promoted to be openly
            shared and then to enable further studies. We are very much happy to have you ("you", "your", "yours",
            "yourself", or the "user") as a researcher, author, reviewer, reader, or contributor to the ecosystem, and
            welcome you to join the community. Before engaging in any activity pertaining to Pluto Inc., we want you to
            thoroughly read and agree to the following Terms of Service (the "Terms"). By agreeing to the Terms, you
            understand that you may be governed under the laws and legislation of any or all of the regions (i) where
            you live, (ii) where you view or edit content on our services, (iii) where other users view your content, or
            (iv) where other users who view your content live, which may include the law in the Republic of Korea where
            we are based ("applicable law").
          </p>

          <p className={styles.subtitle}>SERVICES</p>
          <p className={styles.contents}>
            Pluto Inc. strives to deliver its mission to the academic community by providing services to assist
            researchers in searching, creating, modifying, and sharing scientific research outputs (the "Services"). The
            Terms apply when you view or use any or all of them through our websites located at https://pluto.network/
            or https://scinapse.io/ (our "Websites") or through any means. By accessing or using the Services and/or our
            Websites, you agree to comply with the Terms. If you do not agree to the Terms, you may not access or use
            the Services and/or our Websites.
          </p>

          <p className={styles.subtitle}>PRIVACY POLICY</p>
          <p className={styles.contents}>
            Because the Services are used by people globally, personal information either collected by us or provided by
            yourself may be stored and processed in any place in the world where we or any of our community resides. By
            accessing or using the Services, you consent to any such transfer of information in any such place. Please
            thoroughly look through our Privacy Policy to ensure that you are aware of what and how we collect and use
            your information.
          </p>

          <p className={styles.subtitle}>CONTENT</p>
          <p className={styles.contents}>
            The Services mainly depend on content voluntarily shared by researchers like yourself, but as most
            scientific and research related services do, the Services also depend on content that we collect from
            external sources. The content on the Services (the "Content") may be subject to certain licenses under which
            it is shared from the original sources. To learn more about licenses for particular contents, please
            contact [team@pluto.network] for assistance. Opinions, statements, claims, or other information included in
            the Content and the Services are those of their resepective authors, and should not necessarily be relied
            upon. We do not guarantee the accuracy, completeness, truthfulness, usefulness, or reliability of any
            information on the Services. We also do not endorse nor are responsible for the accuracy or reliability of
            any opinion, advice, or statement made by parties other than us. We will under no circumstances be
            responsible for any loss or damage resulting from anyone's reliance on information or other content posted
            on the Services, or transmitted to users. The Content and the Services are also informational and research
            purposes only. This means they should not be taken as professional advice. Please consult someone licensed
            or qualified for a professional advice on the use and interpretation of information included in the Content
            or the Services. While using the Services you may find Content that is offensive, erroneous, misleading,
            mislabeled, or otherwise objectionable. We reserve the right, but has no obligation, to limit or deny a
            user's access to the Services or take other appropriate action if a user violates the Terms or engages in
            any activity that violates the right of any person or entity or which we deem unlawful, offensive, abusive,
            harmful or malicious. We shall have the right to remove any such material that in its sole opinion violates,
            or is alleged to violate, applicable law or the Terms, or which might be offensive, or that might violate
            the rights, harm, or threaten the safety of users or others. Unauthorized use of the Services may result in
            criminal and/or civil prosecution under certain jurisdiction, including where you live. If you become aware
            of misuse of the Services, please contact [team@pluto.network].
          </p>

          <p className={styles.subtitle}>USER OBLIGATIONS</p>
          <p className={styles.contents}>
            Your use of the Services is for RESEARCH PURPOSES ONLY. Any other use is a violation of the Terms. You are
            responsible for safeguarding your own password and should NEVER disclose it to any third party. The Services
            only exist with the support of the community of users like you who collaborate to write, edit, and curate
            the Content. We are happy to have you participate in this community. We ask you to be civil and polite in
            your interactions with others in the community, to act in good faith, and to make edits and contributions in
            alignment with our mission or with the purposes of the Services. Certain activities, whether legal or
            illegal, may be harmful to other users and violate our rules, and some activities may also subject you to
            liability. Therefore, for your own protection and for that of other users, you may not engage in such
            activities on the Services and/or our Websites. Under any circumstances you should NEVER do ANY of the
            followings:
          </p>
          <ul className={styles.bulletPoint}>
            <li> Engaging in harassment, threats, stalking, spamming, or vandalism </li>
            <li> Transmitting chain mail, junk mail, or spam to other users </li>
            <li> Infringing the privacy rights of others under applicable law </li>
            <li>
              Soliciting personally identifiable information for purposes of harassment, exploitation, violation of
              privacy, or any non-research purpose not explicitly approved by us
            </li>
            <li> Intentionally or knowingly posting content that constitutes libel or defamation</li>
            <li> With the intent to deceive, posting content that is false or inaccurate</li>
            <li>
              Attempting to impersonate another user or individual, misrepresenting your affiliation with any individual
              or entity, or using the username of another user with the intent to deceive
            </li>
            <li> Engaging in fraud</li>
            <li>Infringing copyrights, trademarks, patents, or other proprietary rights under applicable law</li>
            <li> Posting or trafficking in obscene material that is unlawful under applicable law</li>
            <li> Using the services in a manner that is inconsistent with applicable law</li>
            <li>
              Posting or distributing content that contains any viruses, malware, worms, Trojan horses, malicious code,
              or other device that could harm our technical infrastructure or system or that of our users
            </li>
            <li>
              Engaging in automated uses of the Services that are abusive or disruptive of the Services and have not
              been approved by us
            </li>
            <li>
              Disrupting the Services by placing an undue burden on the Services or the networks or servers connected
              with the Services
            </li>
            <li>
              Disrupting the Services by inundating any of the Services with communications or other traffic that
              suggests no serious intent to use the Services for their stated purpose
            </li>
            <li>
              Knowingly accessing, tampering with, or using any of our non-public areas in our computer systems without
              authorization and
            </li>
            <li>
              Probing, scanning, or testing the vulnerability of any of our technical systems or networks unless we
              explicitly approve and cooperate until the end of such actions or the end of their effects.
            </li>
          </ul>
          <p className={styles.contents}>
            We reserve the right to exercise our enforcement discretion with respect to the above terms about user
            obligations.
          </p>

          <p className={styles.subtitle}>DENIAL OF ACCESS</p>
          <p className={styles.contents}>
            The community of users has the major role in shaping, modifying, and generating the protocols that underlie
            the Services. Pluto Inc. rarely intervene in community decisions about protocols and their enforcement. In
            an unusual case, the need may arise, or the community may ask us, to address an especially problematic user
            because of significant disturbance of the Services or dangerous behavior. In such cases, we reserve the
            rights, but do not have obligation, to:
          </p>
          <ul className={styles.bulletPoint}>
            <li>
              Investigate your use of the Services (a) to determine whether a violation of the Terms, the Services
              protocols, or other applicable law or policy has occurred, or (b) to comply with any applicable law, legal
              process, or appropriate governmental request
            </li>
            <li>
              Detect, prevent, or otherwise address fraud, security, or technical issues or respond to user support
              requests
            </li>
            <li> Refuse, disable, or restrict access to the contribution of any user who violates the Terms </li>
            <li>
              Ban a user from editing or contributing or block a user's account or access for actions violating the
              Terms, including repeat copyright infringement
            </li>
            <li>
              Take legal action against users who violate the Terms (including reports to law enforcement authorities)
              and
            </li>
            <li>
              Manage otherwise the Services and our Websites in a manner designed to facilitate their proper functioning
              and protect the rights, property, and safety of ourselves and our users, licensors, partners, and the
              public.
            </li>
          </ul>
          <p className={styles.contents}>
            In the interests of our users and the Services, in the extreme circumstance that any individual has had
            their account or access blocked under this provision, they is prohibited from creating or using another
            account on or seeking access to the same Services, unless we provide explicit permission. Without limiting
            the authority of the community, we will not ban a user from editing or contributing or block a user's
            account or access solely because of good faith criticism that does not result in actions otherwise violating
            the Terms or the Services protocols.
          </p>
          <p className={styles.subtitle}>TRADEMARKS</p>
          <p className={styles.contents}>
            Although you have considerable freedoms for re-use of the Content on the Services under their licenses, it
            is important that we protect our trademark rights so that we can protect our users from fraudulent
            impersonators. Because of this, we ask that you please respect our trademarks. All trademarks related to
            Pluto Inc., Scinapse, the Services and our Websites belong to us, Pluto Inc., and any use of our trade
            names, trademarks, service marks, logos, or domain names must be in compliance with the Terms and applicable
            law.
          </p>

          <p className={styles.subtitle}>INTELLECTUAL PROPERTY</p>

          <p className={styles.contents}>
            You acknowledge and agree that we and our licensors retain ownership of all intellectual property rights of
            any kind related to the Services, including applicable copyrights, trademarks and other proprietary rights.
            Other product and company names that are mentioned on the Services may be trademarks of their respective
            owners. We reserve all rights that are not expressly granted to you under the Terms.
          </p>

          <p className={styles.subtitle}>TERMINATION</p>
          <p className={styles.contents}>
            Though we hope you will stay and continue to contribute to the Services, you can stop using the Services any
            time. In certain circumstances it may be necessary for either ourselves or the community or its members to
            terminate part or all of the Services, terminate the Terms, block your account or access, or ban you as a
            user. If your account or access is blocked or otherwise terminated for any reason, your public contributions
            will remain publicly available (subject to applicable protocols of the Services), and, unless we notify you
            otherwise, you may still access our public pages for the sole purpose of reading publicly available content
            on the Services. In such circumstances, however, you may not be able to access your account or settings. We
            reserve the right to suspend or end the Services at any time, with or without cause, and with or without
            notice. Even after your use and participation are banned, blocked or otherwise suspended, the Terms will
            remain in effect with respect to relevant provisions.
          </p>

          <p className={styles.subtitle}>THIRD PARTY RESOURCES</p>
          <p className={styles.contents}>
            As part of the Services, Pluto Inc. may provide you with convenient links or content to third party
            resources including but not limited to websites, applications, software, and digital files ("third party
            resources"). Third party resources are provided to you as a courtesy. We have no control over third party
            resources or the promotions, materials, information, goods or services available on these third party
            resources. Such third party resources are not investigated, monitored or checked for accuracy,
            appropriateness, or completeness by us, and we are not responsible for any third party resources accessed
            through the Services or our Websites, including the content, accuracy, offensiveness, opinions, reliability,
            privacy practices or other policies of or contained in the third party resources. Inclusion of, linking to,
            permitting the use of, or installation of any third party resources does not imply approval or endorsement
            thereof by Pluto Inc.. If you decide to leave the Services or our Websites and access, use or install any
            third party resources, you do so at your own risk and you should be aware that the Terms no longer govern in
            such access, use or install of third party resources. You should review the applicable terms and policies,
            including privacy and data gathering practices, of any third party resources which you navigate from the
            Services or our Websites.
          </p>

          <p className={styles.subtitle}>DISCLAIMER</p>
          <p className={styles.contents}>
            YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK. WE PROVIDE THE SERVICES ON AN "AS IS" AND "AS AVAILABLE"
            BASIS, AND WE EXPRESSLY DISCLAIM ALL WARRANTIES REGARDING THE SERVICES, EXPRESS, IMPLIED, STATUTORY,
            INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            TITLE, SECURITY, ACCURACY, AND NON-INFRINGEMENT. WE MAKE NO WARRANTY THAT THE SERVICES WILL MEET YOUR
            REQUIREMENTS, BE SAFE, SECURE, UNINTERRUPTED, TIMELY, ACCURATE, OR ERROR-FREE, OR THAT YOUR INFORMATION WILL
            BE SECURE. WE ARE NOT RESPONSIBLE FOR THE CONTENT, DATA, OR ACTIONS OF THIRD PARTIES, AND YOU RELEASE US,
            OUR AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, LICENSORS, AND PARTNERS FROM ANY CLAIMS AND DAMAGES,
            KNOWN AND UNKNOWN, ARISING OUT OF OR IN ANY WAY CONNECTED WITH ANY CLAIM YOU HAVE AGAINST ANY SUCH THIRD
            PARTIES. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM US OR THROUGH OR FROM THE
            SERVICES CREATES ANY WARRANTY NOT EXPRESSLY STATED IN THE TERMS. ANY MATERIAL DOWNLOADED OR OTHERWISE
            OBTAINED THROUGH YOUR USE OF THE SERVICES IS DONE AT YOUR OWN DISCRETION AND RISK, AND YOU WILL BE SOLELY
            RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF ANY
            SUCH MATERIAL. YOU AGREE THAT WE HAVE NO RESPONSIBILITY OR LIABILITY FOR THE DELETION OF, OR THE FAILURE TO
            STORE OR TO TRANSMIT, ANY CONTENT OR COMMUNICATION MAINTAINED BY THE SERVICES. WE RETAIN THE RIGHT TO CREATE
            LIMITS ON USE AND STORAGE AT OUR SOLE DISCRETION AT ANY TIME WITH OR WITHOUT NOTICE. SOME STATES OR
            JURISDICTIONS DO NOT ALLOW THE TYPES OF DISCLAIMERS IN THIS SECTION, SO THEY MAY NOT APPLY TO YOU EITHER IN
            PART OR IN FULL DEPENDING ON THE LAW.
          </p>

          <p className={styles.subtitle}>LIMITATION ON LIABILITY</p>
          <p className={styles.contents}>
            WE, Pluto Inc., OUR AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, LICENSORS, AND PARTNERS WILL NOT BE
            LIABLE TO YOU OR TO ANY OTHER PARTY FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR
            EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER
            INTANGIBLE LOSSES, REGARDLESS OF WHETHER WE WERE ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. IN THE CASE THAT
            APPLICABLE LAW MAY NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY OR INCIDENTAL OR CONSEQUENTIAL
            DAMAGES, THE ABOVE LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU, ALTHOUGH OUR LIABILITY WILL BE LIMITED TO
            THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW.
          </p>

          <p className={styles.subtitle}>DISPUTES AND JURISDICTIONS</p>
          <p className={styles.contents}>
            We hope that no serious disagreements arise involving you, but, in the event there is a dispute, we
            encourage you to seek resolution in coordination with the users community and us. If you seek to file a
            legal claim against us, you agree to file and resolve it exclusively in Seoul Central District Court located
            in 157 Seochojungang-ro, Seocho-gu, Seoul 06594, Republic of Korea. You also agree that the laws of the
            Republic of Korea will govern the Terms, as well as any legal claim that might arise between you and us
            (without reference to conflict of laws principles). You agree to submit to the personal jurisdiction of, and
            agree that venue is proper in, Seoul Central District Court located in 157 Seochojungang-ro, Seocho-gu,
            Seoul 06594, Republic of Korea in any legal action or proceeding relating to us or the Terms. To ensure that
            disputes are dealt with soon after they arise, you agree that regardless of any statute or law to the
            contrary, any claim or cause of action you might have arising out of or related to use of the Services or
            the Terms must be filed within the applicable statute of limitations or, if earlier, within ONE (1) YEAR
            after the pertinent facts underlying such claim or cause of action could have been discovered with
            reasonable diligence. Otherwise, such cause of action is permanently barred.
          </p>

          <p className={styles.subtitle}>MODIFICATION OF TERMS OF SERVICE</p>
          <p className={styles.contents}>
            Just as community's contribution is essential to the Services, it is necessary for us to embrace the
            community's will in the modification of the Terms. To achieve it, we may notify you in advance in case of
            modification to the Terms, about the specifications about the revisions. We may also have a short period of
            time for receiving comments and embrace applicable ones. We may, however, fail to do so when the revisions
            are being made due to legal and administrative reasons. Though we will try to notice the users of changes in
            the Terms, it is your responsibility to check on any such changes in the Terms. We ask you to periodically
            review the most up-to-date version of the Terms from our Websites. Your continuing to access and use the
            Services or our Websites after the new version of the Terms take effect, whether you noticed it or not,
            constitutes an agreement to the new version of the Terms. For the sake of the Services, you, and other
            users, you cannot use the Services if you do not agree with the new version of the Terms.
          </p>

          <p className={styles.subtitle}>GENERAL TERMS</p>
          <p className={styles.contents}>
            The Terms do not create an employment, agency, partnership, or any relationship other than explicitly stated
            in the Terms between you and us, Pluto Inc.. If you have not signed a separate agreement with us, the Terms
            are the entire agreement between you and us. If there is any conflict between the Terms and a signed written
            agreement between you and us, the signed agreement will control. You understand that, unless otherwise
            agreed to in writing by us, you have no expectation of compensation for any activity, contribution, or idea
            that you provide to us, the community, or the Services. If any provision or part of a provision of the Terms
            is found unlawful, invalid, void, or unenforceable, that provision or part of the provision is deemed
            severable from the Terms and will be enforced to the maximum extent permissible with applicable law, and all
            other provisions of the Terms will remain in full force and effect. Our rights under the Terms will survive
            any termination of the Terms. In any circumstance, if we do not apply or enforce any provision of the Terms,
            it is not a waiver of that provision. Nor should it be considered a waiver of such provision when we fail to
            enforce any provision in the Terms. Notwithstanding any provision to the contrary in the Terms, we and you
            agree not to modify the applicable terms and requirements of any license that is employed on the Services or
            the Content when such license is authorized by the Terms. You agree that we may provide you with notices,
            including those regarding changes to the Terms, by email, regular mail, or postings on the Services or our
            Websites. The Terms were written in English. While we hope that translations of the Terms, if any, are
            accurate, in the event of any differences in meaning between the original English version and a translation,
            the original English version takes precedence. We may assign or delegate the Terms, in whole or in part, to
            any person or entity at any time with or without your consent. You may not assign or delegate any rights or
            obligations under the Terms without our prior written consent, and any unauthorized assignment and
            delegation by you is void.
          </p>

          <p className={styles.subtitle}>END OF TERMS OF SERVICE</p>
          <p className={styles.contents}>
            We appreciate your taking the time to read the Terms, and we are very happy to have you contributing to the
            community, the Services, and academia worldwide. Through your contributions, you are helping to build
            something really big – not only an important ecosystem to enable a better practices of scientific research,
            but also a vibrant community of like-minded and engaged peers, focused on a very noble goal.
          </p>
        </div>
        <ImprovedFooter containerStyle={{ backgroundColor: '#f8f9fb' }} />{' '}
      </div>
    );
  }
}

export default TermsOfService;
