import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { BlockDefinition, DocumentBlockInstance } from '../../types';
import { useDocument } from '../../context/DocumentContext';
import { useLanguage } from '../../context/LanguageContext';
import { isBlockVisible } from '../../utils/templateEngine';
import { VariableForm } from '../forms/VariableForm';
import styles from './BlockCard.module.css';

interface Props {
  instance: DocumentBlockInstance;
  definition: BlockDefinition;
  index: number;
  total: number;
}

export function BlockCard({ instance, definition, index, total }: Props) {
  const { state, removeBlock, moveBlock } = useDocument();
  const { t } = useLanguage();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: instance.instanceId,
  });

  const visible = isBlockVisible(definition, state.doc.values);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const canMoveUp = index > 0;
  const canMoveDown = index < total - 1;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${!visible ? styles.cardHidden : ''}`}
      aria-label={definition.title}
    >
      <header className={styles.head}>
        <button
          type="button"
          {...attributes}
          {...listeners}
          className={styles.dragHandle}
          aria-label={t('block.reorderAria', { title: definition.title })}
          title={t('block.dragTitle')}
        >
          <span aria-hidden="true">⋮⋮</span>
        </button>
        <div className={styles.headText}>
          <h3 className={styles.title}>{definition.title}</h3>
          <p className={styles.subtitle}>{definition.description}</p>
        </div>
        <div className={styles.headActions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => moveBlock(index, index - 1)}
            disabled={!canMoveUp}
            aria-label={t('block.moveUp')}
          >
            ↑
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => moveBlock(index, index + 1)}
            disabled={!canMoveDown}
            aria-label={t('block.moveDown')}
          >
            ↓
          </button>
          {definition.required ? (
            <span className={styles.requiredTag} title={t('block.requiredTitle')}>{t('block.required')}</span>
          ) : (
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeBlock(instance.instanceId)}
              aria-label={t('block.removeAria', { title: definition.title })}
            >
              {t('block.remove')}
            </button>
          )}
        </div>
      </header>

      {!visible && definition.condition ? (
        <div className={styles.conditionalNotice}>
          {t('block.hiddenNotice', {
            variable: definition.condition.variable,
            values: definition.condition.equals.join(', '),
          })}
        </div>
      ) : null}

      <div className={styles.body}>
        {definition.variables.length === 0 ? (
          <p className={styles.noVars}>{t('block.noVars')}</p>
        ) : (
          <VariableForm variables={definition.variables} />
        )}
      </div>
    </article>
  );
}
