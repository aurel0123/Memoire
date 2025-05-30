import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PropTypes from 'prop-types'


export function PvPreview({ data }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border shadow-sm text-foreground max-h-[600px] overflow-y-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold uppercase tracking-wide">Procès verbal de soutenance</h2>
        <div className="mt-2 text-muted-foreground">
          {data.date && (
            <time dateTime={data.date.toISOString()}>
              {format(data.date, 'PPP', { locale: fr })} à {data.time}
            </time>
          )} 
          {data.room && <span> - Salle {data.room}</span>}
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">Informations générales</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <span className="font-medium">Étudiant : </span>
              <span>{data.studentName || '(Non spécifié)'}</span>
            </div>
            <div>
              <span className="font-medium">Sujet : </span>
              <span>{data.subject || '(Non spécifié)'}</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">Membres du jury</h3>
          {data.juryMembers.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {data.juryMembers.map((member, index) => (
                <div key={index} className="flex">
                  <span className="font-medium w-32">{member.role} : </span>
                  <span>{member.name || '(Non spécifié)'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">Aucun membre du jury spécifié</p>
          )}
        </section>

        {data.summary && (
          <section>
            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Appréciation</h3>
            <p className="whitespace-pre-wrap">{data.summary}</p>
          </section>
        )}

        <section className="pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Note finale</h3>
            <div className="text-xl font-bold bg-primary/10 text-primary px-4 py-1 rounded">
              {data.finalNote}/20
            </div>
          </div>
        </section>

        <section className="pt-6 border-t">
          <div className="flex justify-between">
            <div>
              <h4 className="font-medium">Signature du président du jury</h4>
              <div className="mt-8 italic text-muted-foreground">
                {data.juryMembers.find(m => m.role === 'Président')?.name || 'Président du jury'}
              </div>
            </div>
            <div className="text-right">
              <h4 className="font-medium">Le {data.date ? format(data.date, 'PPP', { locale: fr }) : '___________'}</h4>
              <div className="h-[80px]"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

PvPreview.propTypes = {
  data : PropTypes.object
}