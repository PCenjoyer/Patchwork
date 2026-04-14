import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMemo } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { useLanguage } from '../../context/LanguageContext';
import { BlockCard } from './BlockCard';
import styles from './BlockList.module.css';

export function BlockList() {
  const { state, moveBlock } = useDocument();
  const { t } = useLanguage();
  const { template, doc } = state;

  const definitionMap = useMemo(
    () => new Map(template.blocks.map((b) => [b.id, b] as const)),
    [template.blocks],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = doc.blocks.findIndex((b) => b.instanceId === active.id);
    const toIndex = doc.blocks.findIndex((b) => b.instanceId === over.id);
    if (fromIndex === -1 || toIndex === -1) return;
    moveBlock(fromIndex, toIndex);
  }

  if (doc.blocks.length === 0) {
    return (
      <div className={styles.empty}>
        <h3>{t('list.emptyTitle')}</h3>
        <p>{t('list.emptyDesc')}</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={doc.blocks.map((b) => b.instanceId)}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.list}>
          {doc.blocks.map((inst, index) => {
            const def = definitionMap.get(inst.definitionId);
            if (!def) return null;
            return (
              <BlockCard
                key={inst.instanceId}
                instance={inst}
                definition={def}
                index={index}
                total={doc.blocks.length}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
