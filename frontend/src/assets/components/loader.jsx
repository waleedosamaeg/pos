import { Atom } from "react-loading-indicators";
import { useTranslation } from 'react-i18next';


export default function Loader() { 
    const {t} = useTranslation()
    return (
     <div className = 'loader'>
            <Atom   color="limegreen" size="small" text={t("loader.text")} textColor="white" />
     </div>
    )
}