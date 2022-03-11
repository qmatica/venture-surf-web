import React, { FC } from 'react'
import { Tags as TagsComponent } from 'common/components/Tags'
import { industries as dicIndustries, stages as dicStages } from 'common/constants'
import styles from './styles.module.sass'

interface ITags {
    tags?: string[]
    stages?: number[]
    industries?: string[]
    activeRole?: 'investor' | 'founder'
}

export const Tags: FC<ITags> = ({
  tags,
  stages,
  industries,
  activeRole
}) => (
  <div className={styles.container}>
    {activeRole && (
      <TagsComponent title="Stage" tags={stages} dictionary={dicStages[activeRole]} minSize />
    )}
    <TagsComponent title="Startup space" tags={industries} dictionary={dicIndustries} minSize />
    <TagsComponent title="Tags" tags={tags} minSize />
  </div>
)
