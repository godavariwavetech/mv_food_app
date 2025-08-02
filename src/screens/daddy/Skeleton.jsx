import { View, Text } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

export default function Skeleton() {
  return (
    <SkeletonPlaceholder>
    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" padding={15}>
      <SkeletonPlaceholder.Item width={30} height={30} borderRadius={15} />
      <SkeletonPlaceholder.Item marginLeft={10}>
        <SkeletonPlaceholder.Item width={200} height={20} />
        <SkeletonPlaceholder.Item marginTop={6} width={150} height={16} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder.Item>

    <SkeletonPlaceholder.Item 
      height={50} 
      borderRadius={8} 
      marginHorizontal={15}
      marginBottom={20}
    />

    <SkeletonPlaceholder.Item
      height={120}
      borderRadius={8}
      marginHorizontal={15}
      marginBottom={20}
    />

    <SkeletonPlaceholder.Item
      flexDirection="row"
      justifyContent="space-between"
      paddingHorizontal={15}
      marginBottom={20}
    >
      {[1,2,3,4].map((_, i) => (
        <SkeletonPlaceholder.Item
          key={i}
          width={70}
          height={70}
          borderRadius={35}
        />
      ))}
    </SkeletonPlaceholder.Item>

    <SkeletonPlaceholder.Item paddingHorizontal={15}>
      {[1,2,3].map((_, i) => (
        <SkeletonPlaceholder.Item
          key={i}
          height={160}
          borderRadius={8}
          marginBottom={20}
        />
      ))}
    </SkeletonPlaceholder.Item>
  </SkeletonPlaceholder>
  )
}