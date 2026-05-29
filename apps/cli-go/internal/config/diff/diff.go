package diff

import (
	"context"
	"fmt"
	"os"

	"github.com/spf13/afero"
	"github.com/supabase/cli/internal/utils"
	"github.com/supabase/cli/internal/utils/flags"
	"github.com/supabase/cli/pkg/config"
)

func Run(ctx context.Context, ref string, fsys afero.Fs) error {
	if err := flags.LoadConfig(fsys); err != nil {
		return err
	}
	client := config.NewConfigUpdater(*utils.GetSupabase())
	remote, err := utils.Config.GetRemoteByProjectRef(ref)
	if err != nil {
		// Use base config when no remote is declared
		remote.ProjectId = ref
	}
	fmt.Fprintln(os.Stderr, "Diffing config for project:", remote.ProjectId)
	return client.DiffRemoteConfig(ctx, remote)
}
