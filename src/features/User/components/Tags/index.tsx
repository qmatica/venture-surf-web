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
    <TagsComponent title="My startup is" tags={industries} dictionary={dicIndustries} minSize />
    {activeRole && (
    <TagsComponent title="My startup space is" tags={stages} dictionary={dicStages[activeRole]} minSize />
    )}
    <TagsComponent title="My keywords" tags={tags} minSize />
  </div>
)
