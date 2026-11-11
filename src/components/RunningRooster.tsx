type Props = {
  active: boolean
}

/** Logo (yellow circle cutout) runs across the control panel while paths fill. */
export function RunningRooster({ active }: Props) {
  return (
    <div className={`rooster-track ${active ? 'is-running' : ''}`} aria-hidden={!active}>
      <img
        className="rooster-runner"
        src={`${import.meta.env.BASE_URL}brand/zloty-kogucik.webp`}
        alt=""
        width={88}
        height={88}
        draggable={false}
      />
    </div>
  )
}
